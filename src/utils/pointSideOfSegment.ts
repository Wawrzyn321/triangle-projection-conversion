import * as THREE from 'three';

export function pointSideOfSegment(A: THREE.Vector2, B: THREE.Vector2, P: THREE.Vector2) {
  const cross = (B.x - A.x) * (P.y - A.y) -
    (B.y - A.y) * (P.x - A.x);

  if (cross > 0) return "left";
  if (cross < 0) return "right";
  return "collinear";
}
