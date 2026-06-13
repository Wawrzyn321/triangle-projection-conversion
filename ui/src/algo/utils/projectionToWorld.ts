import * as THREE from 'three';

// todo used?
export function projectionToWorld(
  projected: THREE.Vector2, // NDC coords in [-1, 1]
  viewProjectionMatrix: THREE.Matrix4,
) {
  const inv = viewProjectionMatrix.clone().invert();

  // Reconstruct full NDC position (x, y, z)
  const ndc = new THREE.Vector3(projected.x, projected.y, 0);

  // Convert from NDC back to world
  return ndc.applyMatrix4(inv);
}
