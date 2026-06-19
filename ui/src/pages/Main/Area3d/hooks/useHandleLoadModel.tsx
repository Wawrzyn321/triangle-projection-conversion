import { clearScene } from '@/algo/utils/clearScene';
import { createWireframe } from '@/algo/utils/createWireframe';
import { getModelBBSize } from '@/pages/Main/Area3d/utils/getModelBBSize';
import { loadGeometryFromFile } from '@/algo/utils/loadGeometryFromFile';
import { type RefObject, useState, useRef } from 'react';
import * as THREE from 'three';
import { type WorldOpts } from '../types';
import { BASE_SCALE } from '../const';
import { resetControls } from '../utils/setupControls';
import { worldToProjection } from '@/algo/utils/worldToProjection';

export function useHandleLoadModel(opts: RefObject<WorldOpts | null>) {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [maxDimension, setMaxDimension] = useState(0);
  const [otherDim, setOtherDim] = useState(0);
  const modelRef = useRef<null | THREE.Mesh>(null);

  const handleLoadModel = async (file: File) => {
    if (!opts.current) {
      throw Error('useHandleLoadModel::handleLoadModel: opts is null');
    }
    const { scene, camera } = opts.current;

    const geometry = await loadGeometryFromFile(file);
    const material = new THREE.MeshStandardMaterial();

    const model = new THREE.Mesh(geometry, material);
    model.add(createWireframe(geometry));

    clearScene(scene);

    scene.add(model);
    modelRef.current = model;

    const size = getModelBBSize(model);
    const maxDimension = Math.max(size.x, size.y, size.z);
    setMaxDimension(maxDimension * 10);
    const scale = BASE_SCALE / maxDimension;
    model.scale.set(scale, scale, scale);

    fn(
      model,
      new THREE.Matrix4().multiplyMatrices(
        camera.threeCamera.projectionMatrix,
        camera.threeCamera.matrixWorldInverse,
      ),
    );

    setOtherDim(0.8);

    setModelLoaded(true);
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
    otherDim,
  };
}
function fn(
  model: THREE.Mesh<
    THREE.BufferGeometry<
      THREE.NormalBufferAttributes,
      THREE.BufferGeometryEventMap
    >,
    THREE.MeshStandardMaterial,
    THREE.Object3DEventMap
  >,
  viewProjectionMatrix: THREE.Matrix4,
) {
  const pos = meshToWorldTriangles(model);
  console.log(pos.map(p => worldToProjection(p, viewProjectionMatrix)));
}

function meshToWorldTriangles(mesh: THREE.Mesh) {
  const geom = mesh.geometry.clone();
  const nonIndexed = geom.index ? geom.toNonIndexed() : geom;
  const posAttr = nonIndexed.getAttribute('position') as THREE.BufferAttribute;

  const triangles: THREE.Vector3[] = [];
  const v = new THREE.Vector3();

  mesh.updateMatrixWorld(true);

  for (let i = 0; i < posAttr.count; i += 3) {
    for (let j = 0; j < 3; j++) {
      v.set(posAttr.getX(i + j), posAttr.getY(i + j), posAttr.getZ(i + j));
      v.applyMatrix4(mesh.matrixWorld);

      triangles.push(v.clone());
    }
  }

  return triangles;
}
