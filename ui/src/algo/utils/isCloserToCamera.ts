import * as THREE from 'three';

export function isCloserToCamera(
  current: THREE.Vector3,
  other: THREE.Vector3,
  viewMatrix: THREE.Matrix4,
) {
  const currentCam = current.clone().applyMatrix4(viewMatrix);
  const otherCam = other.clone().applyMatrix4(viewMatrix);

  return currentCam.z < otherCam.z;
}
