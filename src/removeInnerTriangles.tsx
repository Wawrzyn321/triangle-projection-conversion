import * as THREE from 'three';
import { pointInTriangle } from './algo';
import { ProcessedTriangleData } from './types';

export function removeInnerTriangles(p_triangles: ProcessedTriangleData[]) {
  return p_triangles
    .filter((triangle, triangleIndex) => {
      for (let otherIndex = 0; otherIndex < p_triangles.length; otherIndex++) {
        if (triangleIndex === otherIndex) continue;

        const inTriangle = (point: THREE.Vector2) => {
          return pointInTriangle(point,
            p_triangles[otherIndex][0].edgeSegments[0][0],
            p_triangles[otherIndex][1].edgeSegments[0][0],
            p_triangles[otherIndex][2].edgeSegments[0][0]
          );
        };

        if (inTriangle(triangle[0].edgeSegments[0][0]) &&
          inTriangle(triangle[1].edgeSegments[0][0]) &&
          inTriangle(triangle[2].edgeSegments[0][0])) {
          return false;
        }
      }
      return true;
    });
}
