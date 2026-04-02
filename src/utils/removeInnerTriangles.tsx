import * as THREE from 'three';
import { TriangleData } from './../types';
import { pointInTriangle } from './../utils/pointInTriangle';

export function removeInnerTriangles(p_triangles: TriangleData[]) {
  return p_triangles
    .filter((triangle, triangleIndex) => {
      for (let otherIndex = 0; otherIndex < p_triangles.length; otherIndex++) {
        if (triangleIndex === otherIndex) continue;

        const inTriangle = (point: THREE.Vector2) => {
          return pointInTriangle(point,
            p_triangles[otherIndex].edges[0].edgeSegments2d[0][0],
            p_triangles[otherIndex].edges[1].edgeSegments2d[0][0],
            p_triangles[otherIndex].edges[2].edgeSegments2d[0][0]
          );
        };

        if (inTriangle(triangle.edges[0].edgeSegments2d[0][0]) &&
          inTriangle(triangle.edges[1].edgeSegments2d[0][0]) &&
          inTriangle(triangle.edges[2].edgeSegments2d[0][0])) {
          return false;
        }
      }
      return true;
    });
}
