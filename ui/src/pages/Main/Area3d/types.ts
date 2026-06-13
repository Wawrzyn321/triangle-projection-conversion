import * as THREE from 'three';
import type { Camera } from './Camera';

export type WorldOpts = {
  camera: Camera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
};
