import * as THREE from 'three';

export class Camera {
  #camera: THREE.OrthographicCamera;
  readonly #frustumSize = 10;

  constructor(aspect: number) {
    this.#camera = new THREE.OrthographicCamera(
      (this.#frustumSize * aspect) / -2,
      (this.#frustumSize * aspect) / 2,
      this.#frustumSize / 2,
      this.#frustumSize / -2,
      0.1,
      1000,
    );
    this.#camera.position.set(0, 0, 10000);
    this.#camera.lookAt(0, 0, 0);
  }

  update(aspect: number) {
    this.#camera.left = (-this.#frustumSize * aspect) / 2;
    this.#camera.right = (this.#frustumSize * aspect) / 2;
    this.#camera.top = this.#frustumSize / 2;
    this.#camera.bottom = -this.#frustumSize / 2;

    this.#camera.updateProjectionMatrix();
  }

  get threeCamera(): THREE.OrthographicCamera {
    return this.#camera;
  }
}
