import type { TriangleData } from '@/pages/Main/types';
import * as THREE from 'three';

const EPSILON = 10e-6;

export function removeFlatTriangles(
  triangles: TriangleData[],
  viewProjectionMatrix: THREE.Matrix4,
) {
  return triangles.filter(triangle => {
    const area = projectedArea(
      triangle.edges[0].start,
      triangle.edges[1].start,
      triangle.edges[2].start,
      viewProjectionMatrix,
    );
    return area > EPSILON;
  });
}

export function projectedArea(
  v0: THREE.Vector3,
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  viewProjectionMatrix: THREE.Matrix4,
): number {
  const p0 = new THREE.Vector4(v0.x, v0.y, v0.z, 1).applyMatrix4(
    viewProjectionMatrix,
  );
  const p1 = new THREE.Vector4(v1.x, v1.y, v1.z, 1).applyMatrix4(
    viewProjectionMatrix,
  );
  const p2 = new THREE.Vector4(v2.x, v2.y, v2.z, 1).applyMatrix4(
    viewProjectionMatrix,
  );

  const x0 = p0.x / p0.w;
  const y0 = p0.y / p0.w;

  const x1 = p1.x / p1.w;
  const y1 = p1.y / p1.w;

  const x2 = p2.x / p2.w;
  const y2 = p2.y / p2.w;

  return Math.abs((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) * 0.5;
}
