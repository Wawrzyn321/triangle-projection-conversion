import * as THREE from 'three';
import { worldToProjection } from './utils/worldToProjection';
import { TriangleData, AlgoReturn, Segment2d } from './types';
import { mapInitialTriangles } from './utils/mapInitialTriangles';
import { copyTriangleData } from './utils/copyTriangleData';
import { pointSideOfSegment } from './utils/pointSideOfSegment';
import { segmentIntersection } from './utils/segmentIntersection';
import { sortTriangle } from './utils/sortTriangle';

type Args = {
  camera: THREE.Camera,
  viewProjectionMatrix: THREE.Matrix4;
  callback: (data: AlgoReturn) => Promise<void>
  inputTriangles: number[][]
}

export async function algo({ camera, viewProjectionMatrix, callback, inputTriangles }: Args): Promise<AlgoReturn> {
  const worldToProjectionBound = (point: THREE.Vector3) => {
    return worldToProjection(point, viewProjectionMatrix)
  }

  const triangles: TriangleData[] = mapInitialTriangles(inputTriangles, worldToProjectionBound);

  let processedTriangles: TriangleData[] = [];
  const debugLines: Segment2d[] = [];
  const debugPoints: THREE.Vector2[] = [];

  for (const triangle of triangles) {
    const TEMP = sortTriangle(triangle);
    const currentTriangle = Object.freeze(TEMP);
    const CURRENT_TRIANGLE_NEW_DATA = copyTriangleData(TEMP)

    const nextProcessedTriangles: TriangleData[] = []

    for (const otherTriangle of processedTriangles) {
      const OTHER_TRIANGLE_NEW_DATA = copyTriangleData(otherTriangle);
      const touched = [false, false, false]
      // intersections for other triangle
      console.assert(currentTriangle.edges.length === 3);
      for (let currentTriangleEdgeIndex = 0; currentTriangleEdgeIndex < 3; currentTriangleEdgeIndex++) {
        const newSegmentsForCurrentTriangle: Segment2d[] = [];

        const currentTriangleEdge = currentTriangle.edges[currentTriangleEdgeIndex];
        for (const currentTriangleEdgeSegment of currentTriangleEdge.edgeSegments2d) {
          console.assert(otherTriangle.edges.length === 3);
          for (let otherTriangleEdgeIndex = 0; otherTriangleEdgeIndex < 3; otherTriangleEdgeIndex++) {
            const otherTriangleEdge = otherTriangle.edges[otherTriangleEdgeIndex];
            const newSegmentsForOtherTriangle: Segment2d[] = [];
            for (const otherTriangleEdgeSegment of otherTriangleEdge.edgeSegments2d) {
              await callback({
                triangles: processedTriangles,
                debugLines: [
                  otherTriangleEdgeSegment,
                  currentTriangleEdgeSegment,
                ],
                debugPoints,
              })


              const intersectionPoint = segmentIntersection(
                currentTriangleEdgeSegment[0],
                currentTriangleEdgeSegment[1],
                otherTriangleEdgeSegment[0],
                otherTriangleEdgeSegment[1]
              );
              if (intersectionPoint) {
                debugPoints.push(intersectionPoint);

                const midCurrentTriangleEdge = currentTriangleEdge.start.clone().add(currentTriangleEdge.end).divideScalar(2);
                const midOtherTriangleEdge = otherTriangleEdge.start.clone().add(otherTriangleEdge.end).divideScalar(2);
                const midCurrentTriangleEdgeCameraDistance2 = midCurrentTriangleEdge.clone().project(camera).z;
                const midOtherTriangleEdgeCameraDistance2 = midOtherTriangleEdge.clone().project(camera).z;
                let currentIsCloser = midCurrentTriangleEdgeCameraDistance2 < midOtherTriangleEdgeCameraDistance2;

                if (currentIsCloser) {
                  const otherTrianglePointASide = pointSideOfSegment(currentTriangleEdgeSegment[0], currentTriangleEdgeSegment[1], otherTriangleEdgeSegment[0]);
                  const otherTrianglePointBSide = pointSideOfSegment(currentTriangleEdgeSegment[0], currentTriangleEdgeSegment[1], otherTriangleEdgeSegment[1]);
                  if (otherTrianglePointASide === otherTrianglePointBSide) {
                    throw Error("same")
                  } else {
                    if (otherTrianglePointASide === 'left') {
                      debugPoints.push(otherTriangleEdgeSegment[0]);
                      newSegmentsForOtherTriangle.push([
                        otherTriangleEdgeSegment[0],
                        intersectionPoint,
                      ]);
                    } else {
                      debugPoints.push(otherTriangleEdgeSegment[1]);
                      newSegmentsForOtherTriangle.push([
                        intersectionPoint,
                        otherTriangleEdgeSegment[1],
                      ]);
                    }
                  }
                } else {
                  const currentTrianglePoint0Side = pointSideOfSegment(otherTriangleEdgeSegment[0], otherTriangleEdgeSegment[1], currentTriangleEdgeSegment[0]);
                  const currentTrianglePoint1Side = pointSideOfSegment(otherTriangleEdgeSegment[0], otherTriangleEdgeSegment[1], currentTriangleEdgeSegment[1]);
                  if (currentTrianglePoint0Side === currentTrianglePoint1Side) {
                    throw Error("same")
                  } else {
                    if (currentTrianglePoint0Side === 'left') {
                      debugPoints.push(currentTriangleEdgeSegment[0]);
                      newSegmentsForCurrentTriangle.push([
                        currentTriangleEdgeSegment[0],
                        intersectionPoint,
                      ]);
                    } else {
                      debugPoints.push(currentTriangleEdgeSegment[1]);
                      newSegmentsForCurrentTriangle.push([
                        intersectionPoint,
                        currentTriangleEdgeSegment[1],
                      ]);
                    }
                  }
                }
              }
            }

            if (newSegmentsForOtherTriangle.length) {
              if (!touched[otherTriangleEdgeIndex]) {
                OTHER_TRIANGLE_NEW_DATA.edges[otherTriangleEdgeIndex].edgeSegments2d = newSegmentsForOtherTriangle;
                touched[otherTriangleEdgeIndex] = true;
              } else {
                OTHER_TRIANGLE_NEW_DATA.edges[otherTriangleEdgeIndex].edgeSegments2d.push(...newSegmentsForOtherTriangle);
              }
            }
          }
        }
        if (newSegmentsForCurrentTriangle.length) {
          CURRENT_TRIANGLE_NEW_DATA.edges[currentTriangleEdgeIndex].edgeSegments2d = newSegmentsForCurrentTriangle;
        }
      }
      nextProcessedTriangles.push(OTHER_TRIANGLE_NEW_DATA);
      await callback({
        triangles: processedTriangles,
        debugLines,
        debugPoints,
      })
    }

    processedTriangles = [...nextProcessedTriangles, CURRENT_TRIANGLE_NEW_DATA]
    await callback({
      triangles: processedTriangles,
      debugLines,
      debugPoints,
    })
  }

  return {
    triangles: processedTriangles,
    debugLines,
    debugPoints
  }
}
