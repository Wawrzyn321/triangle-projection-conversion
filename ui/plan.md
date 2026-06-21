# Lazy-Load Three.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Defer Three.js loading so it never downloads on /info or /vote, and loads async on the Main route via a separate cached chunk.

**Architecture:** Four files use `import * as THREE` purely for TypeScript type annotations — changing to `import type` severs Three.js from the main bundle graph. Then `React.lazy` + `Suspense` wraps `Area3d` so its chunk (containing all runtime Three.js code) loads async. Vite `manualChunks` puts Three.js in a stable vendor chunk for cache efficiency.

**Tech Stack:** React 19, Vite 8, Three.js 0.184, TypeScript

---

## File Map

| File                                | Change                                                      |
| ----------------------------------- | ----------------------------------------------------------- |
| `src/pages/Main/types.ts:1`         | `import *` → `import type`                                  |
| `src/pages/Main/iterators.ts:2`     | `import *` → `import type`                                  |
| `src/pages/Main/Area3d/types.ts:1`  | `import *` → `import type`                                  |
| `src/algo/utils/canvasHelpers.ts:2` | `import *` → `import type`                                  |
| `src/pages/Main/Main.tsx`           | Replace static Area3d import with `React.lazy` + `Suspense` |
| `vite.config.ts`                    | Add `build.rollupOptions.output.manualChunks`               |

---

### Task 1: Fix type-only Three.js imports

These four files use `import * as THREE from 'three'` only for TypeScript type annotations. Changing to `import type` tells Vite these imports have no runtime value — no behavioral change, just module graph severing.

**Files:**

- Modify: `src/pages/Main/types.ts:1`
- Modify: `src/pages/Main/iterators.ts:2`
- Modify: `src/pages/Main/Area3d/types.ts:1`
- Modify: `src/algo/utils/canvasHelpers.ts:2`

- [ ] **Step 1: Fix src/pages/Main/types.ts**

```ts
// line 1 — before:
import * as THREE from 'three';

// after:
import type * as THREE from 'three';
```

- [ ] **Step 2: Fix src/pages/Main/iterators.ts**

```ts
// line 2 — before:
import * as THREE from 'three';

// after:
import type * as THREE from 'three';
```

- [ ] **Step 3: Fix src/pages/Main/Area3d/types.ts**

```ts
// line 1 — before:
import * as THREE from 'three';

// after:
import type * as THREE from 'three';
```

- [ ] **Step 4: Fix src/algo/utils/canvasHelpers.ts**

```ts
// line 2 — before:
import * as THREE from 'three';

// after:
import type * as THREE from 'three';
```

- [ ] **Step 5: Verify TypeScript still compiles**

```bash
cd "ui" && npx tsc --noEmit
```

Expected: zero errors. If there are errors, the import was used as a value somewhere — investigate before proceeding.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Main/types.ts src/pages/Main/iterators.ts src/pages/Main/Area3d/types.ts src/algo/utils/canvasHelpers.ts
git commit -m "refactor: change type-only three.js imports to import type"
```

---

### Task 2: Lazy-load Area3d with React.lazy + Suspense

`React.lazy` defers the Area3d chunk (and its Three.js runtime deps) until React needs to mount it. React guarantees the module is fully loaded before `useEffect` runs, so the Three.js scene initialization on mount is safe.

**Files:**

- Modify: `src/pages/Main/Main.tsx`

- [ ] **Step 1: Replace static import with lazy import**

Replace the full contents of `src/pages/Main/Main.tsx`:

```tsx
import { lazy, Suspense, useState } from 'react';
import { Area2d } from './Area2d/Area2d';
import { MainLayout } from './MainLayout';
import type { AlgoReturnWithName } from './Area3d/types';

const Area3d = lazy(() =>
  import('./Area3d/Area3d').then(m => ({ default: m.Area3d })),
);

export function Main() {
  const [result, setResult] = useState<AlgoReturnWithName | null>(null);

  return (
    <MainLayout>
      <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
        <Area3d setResult={setResult} />
      </Suspense>
      <Area2d result={result} />
    </MainLayout>
  );
}
```

The `.then(m => ({ default: m.Area3d }))` re-wraps the named export as a default because `React.lazy` requires `{ default: Component }`. The `Suspense` fallback is a placeholder div so the layout doesn't collapse while loading.

- [ ] **Step 2: Verify TypeScript still compiles**

```bash
cd "ui" && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Main/Main.tsx
git commit -m "feat: lazy-load Area3d to defer three.js bundle"
```

---

### Task 3: Add Vite manualChunks for stable Three.js vendor chunk

Puts Three.js (and all `three/examples/jsm/*` sub-paths) into a named `vendor-three` chunk. This chunk hash only changes when Three.js version changes — not on every app rebuild — improving CDN/browser cache hit rate.

**Files:**

- Modify: `vite.config.ts`

- [ ] **Step 1: Add manualChunks to vite.config.ts**

Replace full contents of `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
// import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [
    react(),
    // analyzer()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'vendor-three';
          }
        },
      },
    },
  },
});
```

- [ ] **Step 2: Build and verify chunk output**

```bash
cd "ui" && npm run build
```

Expected output in `dist/assets/`:

- `index-[hash].js` — app shell (React, Chakra, routing)
- `Area3d-[hash].js` — lazy chunk with Area3d component + algo modules
- `vendor-three-[hash].js` — Three.js library

Confirm Three.js is NOT in the main chunk:

```bash
grep -l "WebGLRenderer" dist/assets/*.js
```

Should return only `vendor-three-[hash].js`, not `index-[hash].js`.

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "build: split three.js into stable vendor chunk"
```

---

## Verification

**Functional smoke test:**

1. `npm run dev` — navigate to `/`, load an STL file, confirm 3D scene renders
2. Orbit, zoom work via OrbitControls
3. Click Project — confirm 2D output renders in Area2d
4. Navigate to `/info` — confirm page loads without Three.js network request

**Bundle verification:**

```bash
npm run build && grep -l "WebGLRenderer" dist/assets/*.js
```

`index-*.js` must NOT appear in results.

**Browser network tab:**

1. DevTools → Network → JS filter
2. Load `/info` — only `index-[hash].js` loads, no `vendor-three-[hash].js`
3. Navigate to `/` — `Area3d-[hash].js` and `vendor-three-[hash].js` appear on demand
