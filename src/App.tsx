import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createCamera, createTriangle, setupControls } from './sceneHelpers';
import { drawFromSegments } from './canvasHelpers';
import { algo } from './algo';
import { FIRST_TRIANGLE, SECOND_TRIANGLE, THIRD_TRIANGLE } from './triangles';

export const WIDTH = 600;
export const HEIGHT = 450;

function App() {
  const rendererRef = useRef<HTMLDivElement | null>(null);
  const sceneOpts = useRef<{
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [ortho, setOrtho] = useState(false);

  useEffect(() => {
    const rendererTarget = rendererRef.current;
    if (!rendererTarget) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('gray');

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    rendererTarget.appendChild(renderer.domElement);

    const camera = createCamera(ortho, WIDTH/HEIGHT);
    const controls = setupControls(camera, renderer);

    scene.add(createTriangle(FIRST_TRIANGLE, 0x00ff00));
    scene.add(createTriangle(SECOND_TRIANGLE, 0x008888));
    scene.add(createTriangle(THIRD_TRIANGLE, 0x888800));

    function animate() {
      controls.update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    sceneOpts.current = {
      camera,
      renderer
    }

    return () => {
      renderer.dispose();
      rendererTarget.removeChild(renderer.domElement)
      sceneOpts.current = null;
    }
  }, [module.hot, ortho])

  return (
    <main>
      <button onClick={() => setOrtho(!ortho)}>Ortho: {ortho.toString()}</button>
      <button onClick={async () => {
        const data = await algo(sceneOpts.current!.camera, sceneOpts.current!.renderer, async data => {
          drawFromSegments(canvasRef.current, data);
          // await new Promise(resolve => setTimeout(resolve, 300));
        });
        drawFromSegments(canvasRef.current, data)
      }}>execute</button>
      <div ref={rendererRef} />
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    </main>
  );
}

export default App;
