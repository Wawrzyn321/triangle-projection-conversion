

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createCamera(aspect: number) {
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

export function createLine(points: [THREE.Vector3, THREE.Vector3], color: number) {
    const material = new THREE.LineBasicMaterial({ color });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(geometry, material);
}

export function createSphere(position: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(0.1, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position.x, position.y, position.z);
    return sphere;

}

export function clearScene(scene: THREE.Scene) {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

export function createWireframe(geometry: THREE.BufferGeometry) {
    return new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0xFFFFFF })
    )
}

