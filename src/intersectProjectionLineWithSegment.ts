import * as THREE from "three";

export function intersectProjectionLineWithSegment(
  rayOrigin: THREE.Vector3,
  rayDir: THREE.Vector3,
  a: THREE.Vector3,
  b: THREE.Vector3
): THREE.Vector3 | null {

  const line = segmentToLine(a, b);

  const p1 = rayOrigin;
  const d1 = rayDir;

  const p2 = line.point;
  const d2 = line.dir;

  const r = p1.clone().sub(p2);

  const a1 = d1.dot(d1);
  const b1 = d1.dot(d2);
  const c1 = d2.dot(d2);
  const d1r = d1.dot(r);
  const e1 = d2.dot(r);

  const denom = a1 * c1 - b1 * b1;

  if (Math.abs(denom) < 1e-6) return null;

  const t = (b1 * e1 - c1 * d1r) / denom;
  const s = (a1 * e1 - b1 * d1r) / denom;

  // 🔥 THIS is the key addition:
  if (s < 0 || s > 1) return null;

  return p1.clone().add(d1.clone().multiplyScalar(t));
}

function segmentToLine(a: THREE.Vector3, b: THREE.Vector3) {
  return {
    point: a,
    dir: b.clone().sub(a)
  };
}