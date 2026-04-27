import * as THREE from 'three';

export function getNormalAndCenter(triangle: number[]) {
  const a = new THREE.Vector3(triangle[0], triangle[1], triangle[2]);
  const b = new THREE.Vector3(triangle[3], triangle[4], triangle[5]);
  const c = new THREE.Vector3(triangle[6], triangle[7], triangle[8]);

  const ab = new THREE.Vector3().subVectors(b, a);
  const ac = new THREE.Vector3().subVectors(c, a);

  const cross = new THREE.Vector3().crossVectors(ab, ac);
  if (cross.lengthSq() === 0) {
    console.log(null)
    return null;
  }
  const normal = cross.normalize();

  const center = a.clone().add(b).add(c).divideScalar(3);

  return {
    normal,
    center
  };
}
