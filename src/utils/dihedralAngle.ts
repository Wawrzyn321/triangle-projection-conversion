import * as THREE from 'three';

export function dihedralAngle(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3) {
  const ab = new THREE.Vector3().subVectors(b, a);
  const ac = new THREE.Vector3().subVectors(c, a);
  const ad = new THREE.Vector3().subVectors(d, a);

  // normals
  const n1 = new THREE.Vector3().crossVectors(ab, ac).normalize();
  const n2 = new THREE.Vector3().crossVectors(ab, ad).normalize();

  // unsigned angle between normals (0..PI)
  return Math.acos(THREE.MathUtils.clamp(n1.dot(n2), -1, 1));
}
