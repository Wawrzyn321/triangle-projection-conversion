import * as THREE from 'three';
import { Camera } from './Camera';
import { getCameraCSSMatrix } from './utils/getCameraCSSMatrix';
import { setupControls } from './utils/setupControls';
import type { RefObject } from 'react';
import type { WorldOpts } from './types';
import ViewCubeController from '@/vendor/three-viewcube';
import type { useColors } from '@/useColors';

export function createScene(
  rendererTarget: HTMLDivElement,
  worldOpts: RefObject<WorldOpts | null>,
  vcControllerRef: RefObject<ViewCubeController | null>,
  vcCubeRef: RefObject<HTMLDivElement | null>,
  colors: ReturnType<typeof useColors>,
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors.BACKGROUND_ACCENT);

  const width = rendererTarget.clientWidth;
  const height = rendererTarget.clientHeight;
  const camera = new Camera(width / height);

  const resizeObserver = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect;
    camera.update(width / height);

    renderer.setSize(width, height, false);
  });

  resizeObserver.observe(rendererTarget);

  const viewCubeController = new ViewCubeController(camera.threeCamera);

  vcControllerRef.current = viewCubeController;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height, false);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  rendererTarget.appendChild(renderer.domElement);

  const controls = setupControls(camera.threeCamera, renderer);

  function animate() {
    controls.update();
    if (vcCubeRef.current) {
      const mat = new THREE.Matrix4();
      mat.extractRotation(camera.threeCamera.matrixWorldInverse);
      vcCubeRef.current.style.transform = `translateZ(-300px) ${getCameraCSSMatrix(
        mat,
      )}`;
    }

    viewCubeController.tweenCallback();
    renderer.render(scene, camera.threeCamera);
  }
  renderer.setAnimationLoop(animate);

  worldOpts.current = {
    camera,
    controls,
    renderer,
    scene,
  };

  return () => {
    renderer.dispose();
    rendererTarget.removeChild(renderer.domElement);
    worldOpts.current = null;
    resizeObserver.disconnect();
  };
}
