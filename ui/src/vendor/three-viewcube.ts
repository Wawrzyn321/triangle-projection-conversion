import { Vector3 } from 'three';
import { Tween, Group, Easing } from '@tweenjs/tween.js';
import * as THREE from 'three';

export type Orientation = {
  offsetFactor: {
    x: number;
    y: number;
    z: number;
  };
};

const TOP: Orientation = {
  offsetFactor: {
    x: 0,
    y: 1,
    z: 0,
  },
};

const BOTTOM: Orientation = {
  offsetFactor: {
    x: 0,
    y: -1,
    z: 0,
  },
};

const FRONT: Orientation = {
  offsetFactor: {
    x: 0,
    y: 0,
    z: 1,
  },
};

const BACK: Orientation = {
  offsetFactor: {
    x: 0,
    y: 0,
    z: -1,
  },
};

const LEFT: Orientation = {
  offsetFactor: {
    x: -1,
    y: 0,
    z: 0,
  },
};

const RIGHT: Orientation = {
  offsetFactor: {
    x: 1,
    y: 0,
    z: 0,
  },
};

class ViewCubeController {
  static CubeOrientation = {
    Top: 'top',
    Bottom: 'bottom',
    Front: 'front',
    Back: 'back',
    Left: 'left',
    Right: 'right',
  };

  static ORIENTATIONS = {
    [ViewCubeController.CubeOrientation.Top]: TOP,
    [ViewCubeController.CubeOrientation.Bottom]: BOTTOM,
    [ViewCubeController.CubeOrientation.Front]: FRONT,
    [ViewCubeController.CubeOrientation.Back]: BACK,
    [ViewCubeController.CubeOrientation.Left]: LEFT,
    [ViewCubeController.CubeOrientation.Right]: RIGHT,
  };

  private camera: THREE.Camera;
  private tweenGroup = new Group();

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  tweenCamera(orientation: Orientation) {
    const { offsetFactor } = orientation;

    if (this.camera) {
      this.tweenGroup.removeAll();

      const offsetUnit = this.camera.position.length();
      const offset = new Vector3(
        offsetUnit * offsetFactor.x,
        offsetUnit * offsetFactor.y,
        offsetUnit * offsetFactor.z,
      );

      const finishPosition = new Vector3().add(offset);
      const targetPosition = new Vector3(0, 0, 0);

      new Tween(this.camera.position, this.tweenGroup)
        .to(
          { x: finishPosition.x, y: finishPosition.y, z: finishPosition.z },
          300,
        )
        .easing(Easing.Cubic.InOut)
        .onUpdate(() => {
          this.camera.lookAt(targetPosition);
        })
        .start();
    }
  }

  tweenCallback() {
    this.tweenGroup.update();
  }
}

export default ViewCubeController;
