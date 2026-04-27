# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server on port 8083
npm test         # Jest tests (watch mode by default)
npm run build    # Production build
```

To run a single test file:
```bash
npm test -- src/utils/tests/segmentIntersection.test.ts
```

## Architecture

This is a React + Three.js app that extracts visible silhouette edges from a 3D scene by projecting triangles and resolving occlusion in 2D projection space.

### Data flow

1. **Input**: Array of triangles (9 numbers each: 3 vertices × xyz)
2. **`mapInitialTriangles.tsx`**: Converts raw vertex data into `TriangleData` — pairs each edge with both its 3D world coordinates and 2D projected coordinates
3. **`algo.ts`**: O(n²) pairwise algorithm — for each pair of triangles, finds 2D edge intersections, resolves which triangle is closer (occlusion), and clips edge segments accordingly. Maintains parallel 2D/3D coords throughout.
4. **`projectResultToScreen.tsx`**: Maps projection-space output to pixel coordinates
5. **`canvasHelpers.ts`**: Draws the resulting segments on a 2D canvas

### Key types (`types.ts`)

```ts
TriangleEdge = { start, end, edgeSegments2d: Segment2d[], edgeSegments3d: Segment3d[] }
TriangleData  = { edges: TriangleEdge[] }
AlgoReturn    = { triangles, debugLines, debugPoints }
```

The parallel 2D/3D representation on each edge segment is load-bearing: 2D is used for intersection math, 3D for depth/occlusion testing.

### Scene setup (`App.tsx` + `utils/sceneHelpers.ts`)

Three.js uses an `OrthographicCamera` managed by `OrbitControls`. Hard-coded test triangles live in `triangles.ts`; real models are loaded via `loadGeometryFromFile.tsx` and converted to the internal format by `meshToWorldTriangles.tsx`. Back-facing triangles are culled before the algorithm runs (`removeOccludedTris.tsx`).

### Geometric utilities (`utils/`)

- `segmentIntersection.ts` — 2D segment intersection
- `pointSideOfSegment.ts` — half-plane test
- `isCloserToCamera.ts` — depth comparison for occlusion
- `removeDullEdges.ts` — removes degenerate/tiny edge segments post-processing
- `buildProjectionLineFromMatrix.ts` + `intersectProjectionLineWithSegment.ts` — 3D ray construction and intersection for unprojecting

### Tests

Jest tests live in `src/utils/tests/`. The geometric utilities are well covered; `algo.ts` itself has no tests.

## tsconfig note

`moduleResolution` is set to `"bundler"` (not `"node"`). This affects import path resolution.
