import * as THREE from 'three';

export function segmentIntersection(
  A: THREE.Vector2,
  B: THREE.Vector2,
  C: THREE.Vector2,
  D: THREE.Vector2,
  epsilon = 1e-6,
) {
  function det(a: THREE.Vector2, b: THREE.Vector2) {
    return a.x * b.y - a.y * b.x;
  }

  const r = new THREE.Vector2().subVectors(B, A);
  const s = new THREE.Vector2().subVectors(D, C);
  const diff = new THREE.Vector2().subVectors(C, A);

  const rxs = det(r, s);

  // Parallel
  if (Math.abs(rxs) < epsilon) {
    return null;
  }

  const t = det(diff, s) / rxs;
  const u = det(diff, r) / rxs;

  if (t >= -epsilon && t <= 1 + epsilon && u >= -epsilon && u <= 1 + epsilon) {
    return new THREE.Vector2(A.x + t * r.x, A.y + t * r.y);
  }

  return null;
}
