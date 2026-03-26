import { MouseEvent, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createCamera, createTriangle, createLine, setupControls } from './sceneHelpers';
import { drawFromSegments } from './canvasHelpers';
import { algo2 } from './algo2';
import { FIRST_TRIANGLE, SECOND_TRIANGLE, THIRD_TRIANGLE, FIRST_LINE, SECOND_LINE } from './triangles';

export const WIDTH = 600;
export const HEIGHT = 450;

function App() {
  const rendererRef = useRef<HTMLDivElement | null>(null);
  const sceneOpts = useRef<{
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    meshes: THREE.Mesh[],
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

    const triangles = [
      createTriangle(FIRST_TRIANGLE, 0x00ff00),
      createTriangle(SECOND_TRIANGLE, 0x008888),
      createTriangle(THIRD_TRIANGLE, 0x888800),
    ]

    triangles.forEach(triangle => scene.add(triangle));

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
      meshes: triangles,
    }

    return () => {
      renderer.dispose();
      rendererTarget.removeChild(renderer.domElement)
      sceneOpts.current = null;
      console.log('destroy')
    }
  }, [module.hot])


  function onClick(event: MouseEvent) {
    const mouse = new THREE.Vector2()
    mouse.set((event.clientX / sceneOpts.current!.renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / sceneOpts.current!.renderer.domElement.clientHeight) * 2 + 1)

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, sceneOpts.current!.camera)
    console.log(mouse);
    const intersects = raycaster.intersectObjects(sceneOpts.current!.meshes, false)
    console.log(intersects);
  }

  return (
    <main>
      <div ref={rendererRef} onClick={onClick} />
      <button style={{ display: 'block' }} onClick={async () => {
        const { camera, renderer, meshes } = sceneOpts.current!
        const data = await algo2(camera, renderer, meshes);
        drawFromSegments(canvasRef.current, data)
      }}>execute</button>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    </main>
  );
}

export default App;
