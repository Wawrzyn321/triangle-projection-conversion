import { clearScene } from '@/algo/utils/clearScene';
import { createWireframe } from '@/algo/utils/createWireframe';
import { getModelBBSize } from '@/pages/Main/Area3d/utils/getModelBBSize';
import { loadGeometryFromFile } from '@/algo/utils/loadGeometryFromFile';
import { type RefObject, useState, useRef } from 'react';
import * as THREE from 'three';
import { type WorldOpts } from '../types';
import { BASE_SCALE, MAX_VERTICES } from '../const';
import { resetControls } from '../utils/setupControls';

export function useHandleLoadModel(opts: RefObject<WorldOpts | null>) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [maxDimension, setMaxDimension] = useState(0);
  const [fileName, setFileName] = useState('');
  const [scalingFactor, setScalingFactor] = useState(0);
  const modelRef = useRef<null | THREE.Mesh>(null);

  const handleLoadModel = async (file: File) => {
    if (!opts.current) {
      throw Error('useHandleLoadModel::handleLoadModel: opts is null');
    }
    const { scene } = opts.current;

    const geometry = await loadGeometryFromFile(file);

    if (geometry.attributes.position.count > MAX_VERTICES) {
      alert(
        `Current algorithm only supports meshes up to ${MAX_VERTICES} vertices, sorry!`,
      );
      return;
    }

    const material = new THREE.MeshStandardMaterial();

    const model = new THREE.Mesh(geometry, material);
    model.add(createWireframe(geometry));

    clearScene(scene);

    scene.add(model);
    modelRef.current = model;

    const size = getModelBBSize(model);
    const maxDimension = Math.max(size.x, size.y, size.z);
    setMaxDimension(maxDimension);
    setScalingFactor(getScalingFactor(maxDimension, 1, 14));
    const scale = BASE_SCALE / maxDimension;
    model.scale.set(scale, scale, scale);

    setModelLoaded(true);
    setFileName(withoutExtension(file.name));
  };

  const handleClearModel = () => {
    if (!opts.current) {
      throw Error('useHandleLoadModel::handleClearModel: opts is null');
    }
    const { scene, controls, camera } = opts.current;

    setModelLoaded(false);
    modelRef.current = null;
    clearScene(scene);
    resetControls(controls, camera.threeCamera);
  };

  return {
    modelRef,
    modelLoaded,
    handleLoadModel,
    handleClearModel,
    maxDimension,
    fileName,
    scalingFactor,
  };
}

function getScalingFactor(dimension: number, min: number, max: number) {
  let scalingFactor = 1;
  let maxIterations = 10;
  while (dimension > max && maxIterations > 0) {
    dimension /= 10;
    scalingFactor /= 10;
    maxIterations--;
  }
  maxIterations = 10;
  while (dimension < min && maxIterations > 0) {
    dimension *= 10;
    scalingFactor *= 10;
    maxIterations--;
  }
  return scalingFactor;
}

function withoutExtension(name: string) {
  return name.substring(0, name.lastIndexOf('.'));
}
