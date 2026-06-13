import { isCloserToCamera } from '../isCloserToCamera';
import * as THREE from 'three';
import {
  frontCameraMatrix,
  skosCameraMatrix,
  rightCameraMatrix,
} from './testutils';

describe('isCloserToCamera', () => {
  it('same point', () => {
    expect(
      isCloserToCamera(
        new THREE.Vector3(5, 10, 15),
        new THREE.Vector3(5, 10, 15),
        frontCameraMatrix(),
      ),
    ).toBe(false);
    expect(
      isCloserToCamera(
        new THREE.Vector3(5, 10, 15),
        new THREE.Vector3(5, 10, 15),
        skosCameraMatrix(),
      ),
    ).toBe(false);
    expect(
      isCloserToCamera(
        new THREE.Vector3(5, 10, 15),
        new THREE.Vector3(5, 10, 15),
        rightCameraMatrix(),
      ),
    ).toBe(false);
  });

  it('camera forward', () => {
    expect(
      isCloserToCamera(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 1000),
        frontCameraMatrix(),
      ),
    ).toBe(true);

    expect(
      isCloserToCamera(
        new THREE.Vector3(0, 0, 1000),
        new THREE.Vector3(0, 0, 0),
        frontCameraMatrix(),
      ),
    ).toBe(false);

    // same distance, different coords
    expect(
      isCloserToCamera(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        frontCameraMatrix(),
      ),
    ).toBe(false);
    expect(
      isCloserToCamera(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
        frontCameraMatrix(),
      ),
    ).toBe(false);

    // same distance, different coords
    expect(
      isCloserToCamera(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        frontCameraMatrix(),
      ),
    ).toBe(false);
    expect(
      isCloserToCamera(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0),
        frontCameraMatrix(),
      ),
    ).toBe(false);
  });
});
