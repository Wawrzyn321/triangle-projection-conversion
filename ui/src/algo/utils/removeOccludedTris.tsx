import * as THREE from 'three';
import { getNormalAndCenter } from './getNormalAndCenter';

export function removeOccludedTris(
  tris: number[][],
  camera: THREE.OrthographicCamera,
) {
  const cameraDir = new THREE.Vector3();
  camera.getWorldDirection(cameraDir);

  return tris.filter(triangle => {
    const normalAndCenter = getNormalAndCenter(triangle);
    if (!normalAndCenter) {
      return false;
    }
    const { normal } = normalAndCenter;

    return normal.dot(cameraDir) <= 0;
  });
}
