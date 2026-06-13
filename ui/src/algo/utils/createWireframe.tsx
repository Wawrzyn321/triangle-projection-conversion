import * as THREE from 'three';

export function createWireframe(geometry: THREE.BufferGeometry) {
  return new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xffffff }),
  );
}
