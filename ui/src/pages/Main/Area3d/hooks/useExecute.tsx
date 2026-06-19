import { algo } from '@/algo/algo';
import { removeOccludedTris } from '@/algo/utils/removeOccludedTris';
import { type RefObject, useState } from 'react';
import * as THREE from 'three';
import type { AlgoReturn, ProgressData } from '../../types';
import type { WorldOpts } from './../types';
import { BASE_SCALE } from '../const';

const MM_PER_CM = 10;

export function useExecute(
  worldOpts: RefObject<WorldOpts | null>,
  setProgressData: (progressData: ProgressData) => void,
) {
  const [isExecuting, setExecuting] = useState(false);

  async function execute(
    inputTriangles: number[][],
    maxDimension: number,
    scalingFactor: number,
  ) {
    if (!worldOpts.current) {
      throw Error('execute: opts are null');
    }
    const { camera } = worldOpts.current;

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

    const zoom = camera.threeCamera.zoom;
    const frustumHalfH = camera.threeCamera.top / zoom;
    const frustumHalfW = camera.threeCamera.right / zoom;
    const physicalScale = (maxDimension / BASE_SCALE) * MM_PER_CM;

    const mmData = applyClipToMm(
      data,
      frustumHalfW,
      frustumHalfH,
      physicalScale * scalingFactor,
    );
    return topLeftAlign(mmData);
  }

  return [isExecuting, execute] as const;
}

function applyClipToMm(
  data: AlgoReturn,
  frustumHalfW: number,
  frustumHalfH: number,
  physicalScale: number,
): AlgoReturn {
  const convert = (pt: THREE.Vector2) =>
    new THREE.Vector2(
      pt.x * frustumHalfW * physicalScale,
      -pt.y * frustumHalfH * physicalScale,
    );

  return {
    triangles: data.triangles.map(triangle => ({
      edges: triangle.edges.map(({ edgeSegments2d, ...rest }) => ({
        ...rest,
        edgeSegments2d: edgeSegments2d.map(segment => segment.map(convert)),
      })),
    })),
    debugLines: data.debugLines.map(segment => segment.map(convert)),
    debugPoints: data.debugPoints.map(convert),
  };
}

function topLeftAlign(data: AlgoReturn): AlgoReturn {
  let minX = Infinity,
    minY = Infinity;

  for (const triangle of data.triangles)
    for (const edge of triangle.edges)
      for (const segment of edge.edgeSegments2d)
        for (const pt of segment) {
          if (pt.x < minX) minX = pt.x;
          if (pt.y < minY) minY = pt.y;
        }

  const shift = (pt: THREE.Vector2) => {
    pt.x -= minX;
    pt.y -= minY;
  };

  for (const triangle of data.triangles)
    for (const edge of triangle.edges)
      for (const segment of edge.edgeSegments2d) segment.forEach(shift);

  for (const segment of data.debugLines) segment.forEach(shift);
  for (const pt of data.debugPoints) shift(pt);

  return data;
}
