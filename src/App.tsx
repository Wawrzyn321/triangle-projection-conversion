import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { createCamera, createTriangle, createLine, setupControls } from './utils/sceneHelpers';
import { drawFromSegments } from './utils/canvasHelpers';
import { projectResultToScreen } from './utils/projectResultToScreen';

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
  const sceneOpts = useRef<{
    camera: THREE.Camera,
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

    scene.add(createLine(FIRST_LINE, 0x00ff00));
    scene.add(createLine(SECOND_LINE, 0x008888));

    function animate() {
      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    sceneOpts.current = {
      camera,
      renderer,
    }

    return () => {
      renderer.dispose();
      rendererTarget.removeChild(renderer.domElement)
      sceneOpts.current = null;
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

  return (
    <main>
      <div ref={rendererRef} />
      <button style={{ display: 'block' }} onClick={async () => {
        const { camera, renderer } = sceneOpts.current!

        const viewProjectionMatrix = new THREE.Matrix4()
          .multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

        const data = await algo({
          camera,
          callback: () => Promise.resolve(),
          inputTriangles: TRIANGLES.map(tri => tri.verts),
          viewProjectionMatrix
        });

        const domElementSize = new THREE.Vector2(renderer.domElement.width, renderer.domElement.height);
        const screenData = projectResultToScreen(data, domElementSize)

        drawFromSegments(canvasRef.current, screenData)
      }}>execute</button>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    </main>
  );
}

export default App;
