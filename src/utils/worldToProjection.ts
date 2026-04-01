import * as THREE from 'three';


export function worldToProjection(
    pos: THREE.Vector3,
    viewProjectionMatrix: THREE.Matrix4
) {
    const vector = pos.clone().applyMatrix4(viewProjectionMatrix);
    return new THREE.Vector2(vector.x, vector.y);
}
