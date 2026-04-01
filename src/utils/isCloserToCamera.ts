import * as THREE from 'three';

export function isCloserToCamera(
    a: THREE.Vector3,
    b: THREE.Vector3,
    viewMatrix: THREE.Matrix4
) {
    const aCam = a.clone().applyMatrix4(viewMatrix);
    const bCam = b.clone().applyMatrix4(viewMatrix);

    // In camera space, Z is negative in front of camera
    return aCam.z > bCam.z;
}