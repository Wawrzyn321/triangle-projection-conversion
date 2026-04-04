import { ChangeEvent, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { createCamera, createTriangle, createLine, setupControls, createSphere } from './utils/sceneHelpers';
import { drawFromSegments } from './utils/canvasHelpers';
import { projectResultToScreen } from './utils/projectResultToScreen';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

import { algo } from './algo';
import { FIRST_TRIANGLE, SECOND_TRIANGLE, THIRD_TRIANGLE, FIRST_LINE, SECOND_LINE } from './triangles';

export const WIDTH = 600;
export const HEIGHT = 450;

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    function animate() {
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
  }, [module.hot])


  // function onClick(event: MouseEvent) {
  //   const mouse = new THREE.Vector2()
  //   mouse.set((event.clientX / sceneOpts.current!.renderer.domElement.clientWidth) * 2 - 1,
  //     -(event.clientY / sceneOpts.current!.renderer.domElement.clientHeight) * 2 + 1)

  //   const raycaster = new THREE.Raycaster()
  //   raycaster.setFromCamera(mouse, sceneOpts.current!.camera)
  //   console.log(mouse);
  //   const intersects = raycaster.intersectObjects(sceneOpts.current!.meshes, false)
  //   console.log(intersects);
  // }

  function execute(inputTriangles: number[][]) {
    const { camera, renderer } = worldOpts.current!

    const viewProjectionMatrix = new THREE.Matrix4()
      .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

    const data = algo({
      inputTriangles,
      viewProjectionMatrix
    });


    const domElementSize = new THREE.Vector2(renderer.domElement.width, renderer.domElement.height);
    const screenData = projectResultToScreen(data, domElementSize)

    // for (const point of screenData.debugSpheres) {
    //   sceneOpts.current!.scene.add(createSphere(point));
    // }

    drawFromSegments(canvasRef.current, screenData)
  }

  async function executeOnFile(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const file = e.target.files![0];
    const data = await file.arrayBuffer();

    const loader = new STLLoader();
    // const geometry = await loader.loadAsync('./FPV-Wing-v3.6-Base_Print.stl')
    const geometry = loader.parse(data)
    const model = new THREE.Mesh(geometry);

    while (worldOpts.current!.scene.children.length > 0) {
      worldOpts.current!.scene.remove(worldOpts.current!.scene.children[0]);
    }

    worldOpts.current!.scene.add(model);

    execute(meshToWorldTriangles(model).map(t => t.flat()));
  }

  return (
    <main>
      <div ref={rendererRef} />
      <button style={{ display: 'block' }} onClick={() => execute(TRIANGLES.map(tri => tri.verts))}>execute</button>
      <input type='file' onChange={executeOnFile} />
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    </main>
  );
}

export default App;


function meshToWorldTriangles(mesh: THREE.Mesh): number[][][] {
  const geom = mesh.geometry.clone();
  const nonIndexed = geom.index ? geom.toNonIndexed() : geom;
  const posAttr = nonIndexed.getAttribute("position") as THREE.BufferAttribute;

  const triangles: number[][][] = [];
  const v = new THREE.Vector3();

  mesh.updateMatrixWorld(true);

  for (let i = 0; i < posAttr.count; i += 3) {
    const tri: number[][] = [];

    for (let j = 0; j < 3; j++) {
      v.set(posAttr.getX(i + j), posAttr.getY(i + j), posAttr.getZ(i + j));
      v.applyMatrix4(mesh.matrixWorld);
      tri.push([v.x, v.y, v.z]);
    }

    triangles.push(tri);
  }

  return triangles;
}