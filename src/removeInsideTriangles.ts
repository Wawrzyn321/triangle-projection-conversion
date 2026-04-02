import * as THREE from 'three';
import { TriangleData, Segment2d } from './types';
import { pointInTriangle } from './utils/pointInTriangle';

function removeInsideTriangles(processedTriangles: TriangleData[], worldToProjectionBound: (point: THREE.Vector3) => THREE.Vector2, camera: THREE.Camera, debugLines: Segment2d[]) {
  return processedTriangles.map((triangle, triangleIndex) => {
    return {
      edges: triangle.edges.map(({ edgeSegments2d, ...rest }) => {
        return {
          ...rest,
          edgeSegments2d: edgeSegments2d.filter(segment => {
            for (let i = 0; i < processedTriangles.length; i++) {
              if (i === triangleIndex) continue;

              const otherTriangle = processedTriangles[i];

              const isInTriangle = (point: THREE.Vector2) => {
                return pointInTriangle(
                  point,
                  worldToProjectionBound(otherTriangle.edges[0].start),
                  worldToProjectionBound(otherTriangle.edges[1].start),
                  worldToProjectionBound(otherTriangle.edges[2].start)
                );
              };

              if (isInTriangle(segment[0]) && isInTriangle(segment[1])) {
                const segmentMid = rest.start.clone().add(rest.end).divideScalar(2);
                const triangleMid = triangle.edges[0].start.clone().add(triangle.edges[1].start).add(triangle.edges[2].start).divideScalar(3);
                const segmentMidCameraDistance = segmentMid.clone().project(camera).z;
                const triangleMidCameraDistance = triangleMid.clone().project(camera).z;

                if (segmentMidCameraDistance > triangleMidCameraDistance) {
                  debugLines.push(segment);
                  return false;
                }
              }
            }
            return true;
          })
        };
      })
    };
  });
}
