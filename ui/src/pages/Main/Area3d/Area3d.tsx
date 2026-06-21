import { Box, Button, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useColors } from '@/useColors';
import * as THREE from 'three';
import ViewCubeController from '@/vendor/three-viewcube';

import { meshToWorldTriangles } from './utils/meshToWorldTriangles';

import type { AlgoReturnWithName, WorldOpts } from './types';
import type { ProgressData } from '../types';

import { Progress } from './components/Progress/Progress';
import { OrientationCube } from './components/OrientationCube/OrientationCube';
import { FileSelectOverlay } from './components/FileSelectOverlay';

import { useHandleLoadModel } from './hooks/useHandleLoadModel';
import { useExecute } from './hooks/useExecute';
import { createScene } from './createScene';
import { BOTTOM_BAR_HEIGHT } from './const';
import { Tip } from './Tip';

type Props = {
  setResult: (result: AlgoReturnWithName | null) => void;
};

export function Area3d({ setResult }: Props) {
  const colors = useColors();
  const rendererRef = useRef<HTMLDivElement | null>(null);
  const worldOpts = useRef<WorldOpts>(null);
  const vcControllerRef = useRef<ViewCubeController>(null);
  const vcCubeRef = useRef<HTMLDivElement>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  const {
    modelRef,
    modelLoaded,
    handleLoadModel,
    handleClearModel,
    maxDimension,
    scalingFactor,
    fileName,
  } = useHandleLoadModel(worldOpts);

  const [isExecuting, execute] = useExecute(worldOpts, setProgressData);

  useEffect(() => {
    const rendererTarget = rendererRef.current;
    if (!rendererTarget) {
      throw Error('Area3d: no rendererTarget');
    }

    const cleanup = createScene(
      rendererTarget,
      worldOpts,
      vcControllerRef,
      vcCubeRef,
      colors,
    );

    return cleanup;
    // for "colors" dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (worldOpts.current) {
      worldOpts.current.scene.background = new THREE.Color(
        colors.BACKGROUND_ACCENT,
      );
    }
  }, [colors]);

  async function executeModel() {
    const model = modelRef.current;
    if (!model) {
      throw Error('executeModel: model is null');
    }
    const result = await execute(
      meshToWorldTriangles(model),
      maxDimension,
      scalingFactor,
    );
    if (result) {
      setResult({ ...result, fileName });
    }
  }

  return (
    <Box h={[undefined, '60vh', '80%']}>
      <Box position="relative" width="100%" height="100%">
        <Box h={`calc(100% - ${BOTTOM_BAR_HEIGHT})`} ref={rendererRef}></Box>
        {!modelLoaded && <FileSelectOverlay onModelLoad={handleLoadModel} />}
        {modelLoaded && (
          <OrientationCube
            vcControllerRef={vcControllerRef}
            cubeRef={vcCubeRef}
          />
        )}
        <Flex columnGap={2} alignItems="center">
          {modelLoaded && <Progress progressData={progressData} />}
          <Box marginLeft="auto" marginTop={1} columnGap={1} display="flex">
            {modelLoaded && (
              <Button
                backgroundColor={
                  colors.theme === 'dark' ? colors.PRIMARY : colors.SECONDARY
                }
                disabled={isExecuting}
                onClick={() => {
                  handleClearModel();
                  setResult(null);
                }}
                color={colors.WHITE}
              >
                Clear
              </Button>
            )}
            <Button
              backgroundColor={
                colors.theme === 'dark' ? colors.SECONDARY : colors.PRIMARY
              }
              disabled={!modelLoaded || isExecuting}
              onClick={executeModel}
              color={colors.WHITE}
            >
              Project
            </Button>
          </Box>
        </Flex>
      </Box>
      <Tip hasModel={modelLoaded} />
    </Box>
  );
}
