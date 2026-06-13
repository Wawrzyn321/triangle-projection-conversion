import { Box, Button, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { Camera } from './Camera';
import { colors } from '@/colors';
import ViewCubeController from '@/vendor/three-viewcube';

import { getCameraCSSMatrix } from './utils/getCameraCSSMatrix';
import { getScaledTriangles } from './utils/getScaledTriangles';
import { setupControls } from './utils/setupControls';

import type { WorldOpts } from './types';
import type { ProgressData } from '../types';

import { Progress } from './components/Progress';
import { OrientationCube } from './components/OrientationCube/OrientationCube';
import { FileSelectOverlay } from './components/FileSelectOverlay';

import { useHandleLoadModel } from './hooks/useHandleLoadModel';
import { useExecute } from './hooks/useExecute';

export function Area3d({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  const rendererRef = useRef<HTMLDivElement | null>(null);
  const worldOpts = useRef<WorldOpts>(null);
  const vcControllerRef = useRef<ViewCubeController>(null);
  const vcCubeRef = useRef<HTMLDivElement>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  const { modelRef, modelLoaded, handleLoadModel } =
    useHandleLoadModel(worldOpts);

  const [isExecuting, execute] = useExecute(worldOpts, canvasRef, setProgressData);

  useEffect(() => {
    const rendererTarget = rendererRef.current;
    if (!rendererTarget) return;

    const cleanup = createScene(rendererTarget, worldOpts, vcControllerRef, vcCubeRef);

    return cleanup;
  }, []);

  function executeModel() {
    const model = modelRef.current;
    if (!model) {
      throw Error('executeModel: model is null');
    }

    execute(getScaledTriangles(model));
  }

  return (
    <Box background="#DDD" h={[undefined, '60vh', '80%']}>
      <Box position="relative" width="100%" height="100%">
        <Box background="white" h="calc(100% - 40px)" ref={rendererRef}></Box>
        {!modelLoaded && <FileSelectOverlay onModelLoad={handleLoadModel} />}
        {modelLoaded && (
          <OrientationCube
            vcControllerRef={vcControllerRef}
            cubeRef={vcCubeRef}
          />
        )}
        <Flex columnGap={2} alignItems='center'>
          <Progress progressData={progressData} />
          <Button
            marginLeft="auto"
            backgroundColor={colors.RIGHT}
            disabled={!modelLoaded || isExecuting}
            onClick={executeModel}
          >
            Project
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

function createScene(rendererTarget: HTMLDivElement, worldOpts: RefObject<WorldOpts | null>, vcControllerRef: RefObject<ViewCubeController | null>, vcCubeRef: RefObject<HTMLDivElement | null>) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(colors.BACKGROUND_GRADIENT);

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

  // let prevTime = 0;
  function animate(_time: DOMHighResTimeStamp) {
    // const dt = time - prevTime;
    // prevTime = time;
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
