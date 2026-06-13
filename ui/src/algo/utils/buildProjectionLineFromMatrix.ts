import * as THREE from 'three';

export function buildProjectionLineFromMatrix(
  ndc: THREE.Vector2,
  viewProjectionMatrix: THREE.Matrix4,
) {
  // Invert the viewProjection matrix
  const invVP = viewProjectionMatrix.clone().invert();

  // Near point in clip space
  const near4 = new THREE.Vector4(ndc.x, ndc.y, -1, 1).applyMatrix4(invVP);
  near4.divideScalar(near4.w);

  // Far point in clip space
  const far4 = new THREE.Vector4(ndc.x, ndc.y, 1, 1).applyMatrix4(invVP);
  far4.divideScalar(far4.w);

  const pNear = new THREE.Vector3(near4.x, near4.y, near4.z);
  const pFar = new THREE.Vector3(far4.x, far4.y, far4.z);

  const dir = pFar.clone().sub(pNear).normalize();

  return {
    origin: pNear,
    direction: dir,
  };
}
