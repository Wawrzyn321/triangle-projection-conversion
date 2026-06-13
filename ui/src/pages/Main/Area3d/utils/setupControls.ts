import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

export function setupControls(
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
) {
  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0, 8);
  controls.target.set(0, 0, 0);
  controls.update();

  return controls;
}
