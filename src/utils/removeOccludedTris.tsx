import * as THREE from 'three';
import { getNormalAndCenter } from './getNormalAndCenter';

export function removeOccludedTris(tris: number[][], cameraPosition: THREE.Vector3) {
  return tris.filter(triangle => {
    const normalAndCenter = getNormalAndCenter(triangle);
    if (!normalAndCenter) {
      return false;
    }
    const { normal, center } = normalAndCenter;

    const toCamera = new THREE.Vector3().subVectors(cameraPosition, center).normalize();

    const facingCamera = normal.dot(toCamera) >= 0;

    return facingCamera;
  })
}
