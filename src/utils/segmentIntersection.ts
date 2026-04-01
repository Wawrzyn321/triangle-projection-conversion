import * as THREE from 'three';

export function segmentIntersection(A: THREE.Vector2, B: THREE.Vector2, C: THREE.Vector2, D: THREE.Vector2, epsilon = 1e-6) {
  function det(a: THREE.Vector2, b: THREE.Vector2) {
    return a.x * b.y - a.y * b.x;
  }

  const r = new THREE.Vector2().subVectors(B, A);
  const s = new THREE.Vector2().subVectors(D, C);
  const diff = new THREE.Vector2().subVectors(C, A);

  const rxs = det(r, s);
  const qpxr = det(diff, r);

  // Parallel
  if (Math.abs(rxs) < epsilon) {

    // Collinear
    if (Math.abs(qpxr) < epsilon) {

      const rdotr = r.dot(r);
      const t0 = diff.dot(r) / rdotr;
      const t1 = t0 + s.dot(r) / rdotr;

      // Overlap test
      if ((t0 >= 0 && t0 <= 1) ||
        (t1 >= 0 && t1 <= 1) ||
        (t0 < 0 && t1 > 1) ||
        (t1 < 0 && t0 > 1)) {
        // return midpoint of overlap (simple choice)
        return null;
        // const t = Math.max(0, Math.min(1, (t0 + t1) * 0.5));
        // return new THREE.Vector2(
        //   A.x + r.x * t,
        //   A.y + r.y * t,
        // );
      }

      return null;
    }

    // Parallel non-intersecting
    return null;
  }

  const t = det(diff, s) / rxs;
  const u = det(diff, r) / rxs;

  if (t >= -epsilon && t <= 1 + epsilon &&
    u >= -epsilon && u <= 1 + epsilon) {
    return new THREE.Vector2(
      A.x + t * r.x,
      A.y + t * r.y
    );
  }

  return null;
}
