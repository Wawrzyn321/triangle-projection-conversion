import * as THREE from 'three';
import type { Camera } from './Camera';
import type { OrbitControls } from 'three/examples/jsm/Addons.js';
import type { AlgoReturn } from '../types';

export type WorldOpts = {
  camera: Camera;
  controls: OrbitControls;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
};

export type AlgoReturnWithName = AlgoReturn & { fileName: string };
