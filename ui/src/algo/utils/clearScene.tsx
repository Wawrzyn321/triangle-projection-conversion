import * as THREE from 'three';

export function clearScene(scene: THREE.Scene) {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
}
