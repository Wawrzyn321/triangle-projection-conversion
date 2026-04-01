import * as THREE from 'three';
import { ProcessedTriangleData } from './types';


export function mapInitialTriangles(inputTriangles: number[][], worldToScreenBound: (point: THREE.Vector3) => THREE.Vector2): ProcessedTriangleData[] {
  return inputTriangles.map(triangle => {
    const vert1 = new THREE.Vector3(triangle[0], triangle[1], triangle[2]);
    const vert2 = new THREE.Vector3(triangle[3], triangle[4], triangle[5]);
    const vert3 = new THREE.Vector3(triangle[6], triangle[7], triangle[8]);

    const vert1_2d = worldToScreenBound(vert1);
    const vert2_2d = worldToScreenBound(vert2);
    const vert3_2d = worldToScreenBound(vert3);

    return {
      edges: [
        {
          start: vert1,
          end: vert2,
          edgeSegments: [[vert1_2d, vert2_2d]],
        },
        {
          start: vert2,
          end: vert3,
          edgeSegments: [[vert2_2d, vert3_2d]],
        },
        {
          start: vert3,
          end: vert1,
          edgeSegments: [[vert3_2d, vert1_2d]]
        }
      ]
    }
  });
}
