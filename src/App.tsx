import { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { clearScene, createCamera, createTriangle, createWireframe, setupControls } from './utils/sceneHelpers';
import { drawFromSegments } from './utils/canvasHelpers';
import { projectResultToScreen } from './utils/projectResultToScreen';

import { algo } from './algo';
import { FIRST_TRIANGLE, SECOND_TRIANGLE, THIRD_TRIANGLE } from './triangles';
import { meshToWorldTriangles } from './utils/meshToWorldTriangles';
import { removeOccludedTris } from './utils/removeOccludedTris';
import { CameraAnimator } from './CameraAnimator';
import { loadGeometryFromFile } from './utils/loadGeometryFromFile';
import { CameraPresets } from './CameraPresets';
import { getModelBBSize } from './utils/getModelBBSize';

const WIDTH = 600;
const HEIGHT = 450;
const BASE_SCALE = 4;

const TRIANGLES = [{
  verts: FIRST_TRIANGLE,
  color: 0x00ff00
}, {
  verts: SECOND_TRIANGLE,
  color: 0x008888,
}, {
  verts: THIRD_TRIANGLE,
  color: 0x888800
}]

function App() {
  const rendererRef = useRef<HTMLDivElement | null>(null);
  const worldOpts = useRef<{
    camera: THREE.Camera,
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
  } | null>(null);
  const modelRef = useRef<null | THREE.Mesh>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animatorRef = useRef<CameraAnimator | null>(null);
  const [message, setMessage] = useState('')

  useEffect(() => {
    const rendererTarget = rendererRef.current;
    if (!rendererTarget) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('gray');

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    rendererTarget.appendChild(renderer.domElement);

    const camera = createCamera(WIDTH / HEIGHT);
    const controls = setupControls(camera, renderer);

    TRIANGLES.forEach(triangle => scene.add(createTriangle(triangle.verts, triangle.color)));
    console.log(controls);

    const animator = new CameraAnimator(camera, controls);
    animatorRef.current = animator;

    // let prevTime = 0;
    function animate(time: DOMHighResTimeStamp) {
      // const dt = time - prevTime;
      // prevTime = time;
      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    worldOpts.current = {
      camera,
      renderer,
      scene
    }

    return () => {
      renderer.dispose();
      rendererTarget.removeChild(renderer.domElement)
      worldOpts.current = null;
      console.log('destroy')
    }
    // eslint-disable-next-line
  }, [module.hot])

  async function execute(inputTriangles: number[][]) {
    const { camera, renderer } = worldOpts.current!

    const viewProjectionMatrix = new THREE.Matrix4()
      .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

    const data = await algo({
      inputTriangles,
      viewProjectionMatrix,
      callback: ({ triangles, maxTriangles, iterationsProgress }) => {
        setMessage(`Triangles: ${triangles}/${maxTriangles}, iterations: ${iterationsProgress.toFixed(2)}%`);
      }
    });

    const domElementSize = new THREE.Vector2(renderer.domElement.width, renderer.domElement.height);
    const screenData = projectResultToScreen(data, domElementSize)

    drawFromSegments(canvasRef.current, screenData)
  }

  async function loadModel(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const { scene } = worldOpts.current!;

    if (!e.target.files) return;

    const geometry = await loadGeometryFromFile(e.target.files[0]);

    // scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // const dirLight = new THREE.DirectionalLight(0xffffff, 100);
    // dirLight.position.set(5, 10, 5);
    // scene.add(dirLight);

    const material = new THREE.MeshStandardMaterial({
      color: 0x808080,
    });

    //     const material = new THREE.MeshStandardMaterial({
    //   color: 0xcccccc,
    //   roughness: 0.6,
    //   metalness: 0.1,
    // });
    const model = new THREE.Mesh(geometry, material);
    model.add(createWireframe(geometry));

    clearScene(scene);

    scene.add(model);

    modelRef.current = model;

    const size = getModelBBSize(model);
    const scale = BASE_SCALE / Math.max(size.x, size.y, size.z);
    model.scale.set(scale, scale, scale);
  }

  function executeModel() {
    const model = modelRef.current;
    if (!model) return;

    const tris = meshToWorldTriangles(model)

    const size = getModelBBSize(model);
    const scale = BASE_SCALE / Math.max(size.x, size.y, size.z);

    for (const triangle of tris) {
      for (let i = 0; i < 9; i++) {
        triangle[i] *= scale;
      }
    }

    const nextTris = removeOccludedTris(tris, worldOpts.current!.camera.position);
    console.log(tris.length, nextTris.length)
    execute(nextTris);
  }

  return (
    <main>
      {message}
      <div ref={rendererRef} />
      <div>
        <button onClick={() => execute(TRIANGLES.map(tri => tri.verts))}>execute on triangles</button>
        <input type='file' onChange={loadModel} />
        <button onClick={executeModel}>execute on model</button>
        <div>
          <CameraPresets animatorRef={animatorRef} objectRef={modelRef} />
        </div>
      </div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    </main>
  );
}

export default App;
