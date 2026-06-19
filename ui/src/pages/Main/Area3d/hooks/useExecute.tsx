import { algo } from '@/algo/algo';
import { projectResultToScreen } from '@/algo/utils/projectResultToScreen';
import { removeOccludedTris } from '@/algo/utils/removeOccludedTris';
import { type RefObject, useState } from 'react';
import * as THREE from 'three';
import type { AlgoReturn, ProgressData } from '../../types';
import type { WorldOpts } from './../types';

export function useExecute(
  worldOpts: RefObject<WorldOpts | null>,
  setProgressData: (progressData: ProgressData) => void,
) {
  const [isExecuting, setExecuting] = useState(false);

  async function execute(inputTriangles: number[][], size: number) {
    if (!worldOpts.current) {
      throw Error('execute: opts are null');
    }
    const { camera, renderer } = worldOpts.current;

    setExecuting(true);
    const nextTris = removeOccludedTris(inputTriangles, camera.threeCamera);

    const viewProjectionMatrix = new THREE.Matrix4().multiplyMatrices(
      camera.threeCamera.projectionMatrix,
      camera.threeCamera.matrixWorldInverse,
    );

    const data = await algo({
      inputTriangles: nextTris,
      viewProjectionMatrix,
      callback: data => setProgressData({ ...data }),
    });

    setExecuting(false);

    const domElementSize = new THREE.Vector2(
      renderer.domElement.width,
      renderer.domElement.height,
    );

    const screenData = projectResultToScreen(data, domElementSize);

    return topLeftAlign(screenData, size);
  }

  return [isExecuting, execute] as const;
}

function topLeftAlign(data: AlgoReturn, size: number): AlgoReturn {
  let minX = Infinity,
    minY = Infinity;

  for (const triangle of data.triangles) {
    for (const edge of triangle.edges) {
      for (const segment of edge.edgeSegments2d) {
        for (const pt of segment) {
          if (pt.x < minX) minX = pt.x;
          if (pt.y < minY) minY = pt.y;
        }
      }
    }
  }

  const transform = (pt: THREE.Vector2) => {
    pt.x -= minX;
    pt.y -= minY;
    pt.x /= size;
    pt.y /= size;
  };

  for (const triangle of data.triangles)
    for (const edge of triangle.edges)
      for (const segment of edge.edgeSegments2d) segment.forEach(transform);

  for (const segment of data.debugLines) segment.forEach(transform);
  for (const pt of data.debugPoints) transform(pt);

  return data;
}
