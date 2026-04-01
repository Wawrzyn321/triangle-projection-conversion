import * as THREE from 'three';

export function frontCameraMatrix() {
    const eye = new THREE.Vector3(0, 0, 5);
    const target = new THREE.Vector3(0, 0, 0);
    const up = new THREE.Vector3(0, 1, 0);
    return new THREE.Matrix4().lookAt(eye, target, up).invert();
}

export function rightCameraMatrix() {
    const eye = new THREE.Vector3(5, 0, 0);
    const target = new THREE.Vector3(0, 0, 0);
    const up = new THREE.Vector3(0, 1, 0);

    return new THREE.Matrix4().lookAt(eye, target, up).invert();
}

export function skosCameraMatrix() {
    const eye = new THREE.Vector3(10, 10, 10);
    const target = new THREE.Vector3(0, 0, 0);
    const up = new THREE.Vector3(0, 1, 0);

    return new THREE.Matrix4().lookAt(eye, target, up).invert();
}
