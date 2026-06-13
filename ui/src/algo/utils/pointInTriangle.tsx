import * as THREE from 'three';

export function pointInTriangle(
  pt: THREE.Vector2,
  v1: THREE.Vector2,
  v2: THREE.Vector2,
  v3: THREE.Vector2,
) {
  function sign(p1: THREE.Vector2, p2: THREE.Vector2, p3: THREE.Vector2) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  const d1 = sign(pt, v1, v2);
  const d2 = sign(pt, v2, v3);
  const d3 = sign(pt, v3, v1);

  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNeg && hasPos);
}
