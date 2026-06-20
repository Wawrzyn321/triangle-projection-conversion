import * as THREE from 'three';

export function meshToWorldTriangles(mesh: THREE.Mesh) {
  const geom = mesh.geometry.clone();
  const nonIndexed = geom.index ? geom.toNonIndexed() : geom;
  const posAttr = nonIndexed.getAttribute('position') as THREE.BufferAttribute;

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

  return triangles.map(t => t.flat());
}
