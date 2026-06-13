import { algo } from '@/algo/algo';
import { drawFromSegments } from '@/algo/utils/canvasHelpers';
import { projectResultToScreen } from '@/algo/utils/projectResultToScreen';
import { removeOccludedTris } from '@/algo/utils/removeOccludedTris';
import { type RefObject, useState } from 'react';
import * as THREE from 'three';
import type { ProgressData } from '../../types';
import type { WorldOpts } from './../types';

export function useExecute(worldOpts: RefObject<WorldOpts | null>, canvasRef: RefObject<HTMLCanvasElement | null>, setProgressData: (progressData: ProgressData) => void) {
  const [isExecuting, setExecuting] = useState(false);

  async function execute(inputTriangles: number[][]) {
    if (!worldOpts.current) {
      throw Error("execute: opts are null");
    }
    const { camera, renderer } = worldOpts.current;

    setExecuting(true);
    const nextTris = removeOccludedTris(
      inputTriangles,
      camera.threeCamera
    );

    const viewProjectionMatrix = new THREE.Matrix4().multiplyMatrices(
      camera.threeCamera.projectionMatrix,
      camera.threeCamera.matrixWorldInverse
    );

    const data = await algo({
      inputTriangles: nextTris,
      viewProjectionMatrix,
      callback: data => {
        console.log({ data });
        return setProgressData(data);
      }
    });
    setExecuting(false);

    const domElementSize = new THREE.Vector2(
      renderer.domElement.width,
      renderer.domElement.height
    );
    const screenData = projectResultToScreen(data, domElementSize);

    drawFromSegments(canvasRef!.current, screenData);
  }

  return [isExecuting, execute] as const;
}
