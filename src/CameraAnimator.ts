import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraAnimator {
  static PRESETS = {
    front: new THREE.Vector3(0, 0, 10),
    back: new THREE.Vector3(0, 0, -10),
    top: new THREE.Vector3(0, 10, 0),
    bottom: new THREE.Vector3(0, -10, 0),
    left: new THREE.Vector3(-10, 0, 0),
    right: new THREE.Vector3(10, 0, 0),
  };

  #camera: THREE.Camera;
  #controls: OrbitControls;

  // #isAnimating = false;
  // #targetPosition = new THREE.Vector3(0, 0, 0);

  constructor(camera: THREE.Camera, controls: OrbitControls) {
    this.#camera = camera;
    this.#controls = controls;
  }

  // update(dt: number) {
  //   if (!this.#isAnimating) return;

  //   const diff = this.#camera.position.clone().sub(this.#targetPosition)

  //   if (diff.length() < 0.1) {
  //     this.#camera.position.set(
  //       this.#targetPosition.x,
  //       this.#targetPosition.y,
  //       this.#targetPosition.z
  //     )
  //     this.#isAnimating = false;
  //     this.#controls.enabled = true;
  //   }
  //   const step = diff.clone().multiplyScalar(dt / 100);
  //   this.#camera.position.sub(step);
  // }

  directAt(preset: keyof typeof CameraAnimator.PRESETS, target: THREE.Vector3 | undefined) {
    const position = CameraAnimator.PRESETS[preset];
    if (target) {
      this.#camera.position.set(
        position.x,
        position.y,
        position.z
      )

      this.#controls.target = target.clone();
    } else {
      position.clone().add(this.#controls.target);
      this.#camera.position.set(
        position.x,
        position.y,
        position.z
      )
    }
  }

  // #startAnimation(targetRotation: THREE.Vector3) {
  //   this.#isAnimating = true;
  //   this.#controls.enabled = false;
  //   this.#targetPosition = targetRotation;
  // }
}
