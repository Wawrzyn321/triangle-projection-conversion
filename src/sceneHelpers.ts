

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createCamera(ortho: boolean, aspect: number) {
    if (ortho) {
        const frustumSize = 10;
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        camera.position.set(0, 0, 10000);
        camera.lookAt(0, 0, 0);
        return camera;
    }
    return new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
}

export function worldToScreen(
    pos: THREE.Vector3,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
) {
    const vector = pos.clone().project(camera);
    const widthHalf = renderer.domElement.width / 2;
    const heightHalf = renderer.domElement.height / 2;

    return new THREE.Vector2(
        vector.x * widthHalf + widthHalf,
        -vector.y * heightHalf + heightHalf
    );
}

export function setupControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.set(0, 0, 8);

    controls.target.set(0, 0, 0);
    controls.update();

    return controls;
}

export function createTriangle(verts: number[], color: number) {
    if (verts.length !== 9) throw Error("Invalid vert count " + verts.length)
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array(verts);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals(); // optional (for lighting)

    // Material (2-sided)
    const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide
    });

    // Mesh
    const triangle = new THREE.Mesh(geometry, material);

    return triangle;
}
