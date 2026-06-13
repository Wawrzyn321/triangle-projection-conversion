import { clearScene } from '@/algo/utils/clearScene';
import { createWireframe } from '@/algo/utils/createWireframe';
import { getModelBBSize } from '@/pages/Main/Area3d/utils/getModelBBSize';
import { loadGeometryFromFile } from '@/algo/utils/loadGeometryFromFile';
import { type RefObject, useState, useRef } from 'react';
import * as THREE from 'three';
import { type WorldOpts } from '../types';
import { BASE_SCALE } from '../const';

export function useHandleLoadModel(opts: RefObject<WorldOpts | null>) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const modelRef = useRef<null | THREE.Mesh>(null);

  const handleLoadModel = async function (file: File) {
    if (!opts.current) {
      throw Error('useHandleLoadModel::handleLoadModel: opts is null');
    }
    const { scene } = opts.current;

    const geometry = await loadGeometryFromFile(file);
    const material = new THREE.MeshStandardMaterial();

    const model = new THREE.Mesh(geometry, material);
    model.add(createWireframe(geometry));

    clearScene(scene);

    scene.add(model);
    modelRef.current = model;

    const size = getModelBBSize(model);
    const scale = BASE_SCALE / Math.max(size.x, size.y, size.z);
    model.scale.set(scale, scale, scale);

    setModelLoaded(true);
  };

  return { modelRef, modelLoaded, handleLoadModel };
}
