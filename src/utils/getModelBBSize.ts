import * as THREE from 'three';

export function getModelBBSize(model: THREE.Mesh) {
    const box = new THREE.Box3().setFromObject(model);
    return box.getSize(new THREE.Vector3());
}
