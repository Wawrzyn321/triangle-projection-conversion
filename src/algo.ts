import * as THREE from 'three';
import { worldToProjection } from './utils/worldToProjection';
import { TriangleData, AlgoReturn, Segment2d, Segment3d, ProgressData } from './types';
import { mapInitialTriangles } from './utils/mapInitialTriangles';
import { copyTriangleData } from './utils/copyTriangleData';
import { pointSideOfSegment } from './utils/pointSideOfSegment';
import { segmentIntersection } from './utils/segmentIntersection';
import { sortTriangle } from './utils/sortTriangle';
import { buildProjectionLineFromMatrix } from './buildProjectionLineFromMatrix';
import { intersectProjectionLineWithSegment } from './intersectProjectionLineWithSegment';
import { isCloserToCamera } from './utils/isCloserToCamera';
import { removeDullEdges } from './utils/removeDullEdges';

const MIN_SEGMENT_WIDTH_SQ = 0.005;

type Args = {
  viewProjectionMatrix: THREE.Matrix4;
  inputTriangles: number[][];
  callback(progress: ProgressData): void;
}

export async function algo({ viewProjectionMatrix, inputTriangles, callback }: Args): Promise<AlgoReturn> {
  const worldToProjectionBound = (point: THREE.Vector3) => {
    return worldToProjection(point, viewProjectionMatrix)
  }

  const triangles: TriangleData[] = mapInitialTriangles(inputTriangles, worldToProjectionBound);

  const p: ProgressData = {
    iterationsProgress: 0,
    maxTriangles: triangles.length,
    triangles: 0,
  }

  let t = 0;
  let prevProgress = 0;

  let processedTriangles: TriangleData[] = [];
  // const debugLines: Segment2d[] = [];
  const debugPoints: THREE.Vector2[] = [];

  for (const triangle of triangles) {
    const TEMP = sortTriangle(triangle);
    const currentTriangle = Object.freeze(TEMP);
    const CURRENT_TRIANGLE_NEW_DATA = copyTriangleData(TEMP)

    const nextProcessedTriangles: TriangleData[] = []

    for (const otherTriangle of processedTriangles) {
      t++;

      const OTHER_TRIANGLE_NEW_DATA = copyTriangleData(otherTriangle);
      const touched = [false, false, false]
      // intersections for other triangle
      console.assert(currentTriangle.edges.length === 3);
      for (let currentTriangleEdgeIndex = 0; currentTriangleEdgeIndex < 3; currentTriangleEdgeIndex++) {
        const newSegments2dForCurrentTriangle: Segment2d[] = [];
        const newSegments3dForCurrentTriangle: Segment3d[] = [];

        const currentTriangleEdge = currentTriangle.edges[currentTriangleEdgeIndex];
        for (let currentTriangleEdgeSegmentIndex = 0; currentTriangleEdgeSegmentIndex < currentTriangleEdge.edgeSegments2d.length; currentTriangleEdgeSegmentIndex++) {
          const currentTriangleEdgeSegment = currentTriangleEdge.edgeSegments2d[currentTriangleEdgeSegmentIndex];
          const currentTriangleEdgeSegment3d = currentTriangleEdge.edgeSegments3d[currentTriangleEdgeSegmentIndex];

          if (currentTriangleEdgeSegment[0].distanceToSquared(currentTriangleEdgeSegment[1]) <= MIN_SEGMENT_WIDTH_SQ) {
            continue;
          }

          console.assert(otherTriangle.edges.length === 3);
          for (let otherTriangleEdgeIndex = 0; otherTriangleEdgeIndex < 3; otherTriangleEdgeIndex++) {
            const otherTriangleEdge = otherTriangle.edges[otherTriangleEdgeIndex];
            const newSegments2dForOtherTriangle: Segment2d[] = [];
            const newSegments3dForOtherTriangle: Segment3d[] = [];
            for (let otherTriangleEdgeSegmentIndex = 0; otherTriangleEdgeSegmentIndex < otherTriangleEdge.edgeSegments2d.length; otherTriangleEdgeSegmentIndex++) {
              const otherTriangleEdgeSegment = otherTriangleEdge.edgeSegments2d[otherTriangleEdgeSegmentIndex];
              const otherTriangleEdgeSegment3d = otherTriangleEdge.edgeSegments3d[otherTriangleEdgeSegmentIndex];


              if (otherTriangleEdgeSegment[0].distanceToSquared(otherTriangleEdgeSegment[1]) <= MIN_SEGMENT_WIDTH_SQ) {
                continue;
              }

              if (currentTriangleEdgeSegment[0].equals(otherTriangleEdgeSegment[0]) || currentTriangleEdgeSegment[0].equals(otherTriangleEdgeSegment[1])
                || currentTriangleEdgeSegment[1].equals(otherTriangleEdgeSegment[0]) || currentTriangleEdgeSegment[1].equals(otherTriangleEdgeSegment[1])
              ) {
                continue;
              }

              const intersectionPoint = segmentIntersection(
                currentTriangleEdgeSegment[0],
                currentTriangleEdgeSegment[1],
                otherTriangleEdgeSegment[0],
                otherTriangleEdgeSegment[1]
              );
              if (intersectionPoint) {
                debugPoints.push(intersectionPoint);

                const projectionLine = buildProjectionLineFromMatrix(
                  intersectionPoint,
                  viewProjectionMatrix
                );
                const currentEdgePoint = intersectProjectionLineWithSegment(projectionLine.origin, projectionLine.direction, currentTriangleEdgeSegment3d);
                const otherEdgePoint = intersectProjectionLineWithSegment(projectionLine.origin, projectionLine.direction, otherTriangleEdgeSegment3d);

                const currentIsCloser = isCloserToCamera(currentEdgePoint, otherEdgePoint, viewProjectionMatrix)

                if (currentIsCloser) {
                  const otherTrianglePointASide = pointSideOfSegment(currentTriangleEdgeSegment[0], currentTriangleEdgeSegment[1], otherTriangleEdgeSegment[0]);
                  const otherTrianglePointBSide = pointSideOfSegment(currentTriangleEdgeSegment[0], currentTriangleEdgeSegment[1], otherTriangleEdgeSegment[1]);
                  if (otherTrianglePointASide === otherTrianglePointBSide) {
                    // console.log("same")
                  } else {
                    if (otherTrianglePointASide === 'left') {
                      debugPoints.push(otherTriangleEdgeSegment[0]);
                      newSegments2dForOtherTriangle.push([
                        otherTriangleEdgeSegment[0],
                        intersectionPoint,
                      ]);
                      newSegments3dForOtherTriangle.push([
                        otherTriangleEdgeSegment3d[1],
                        otherEdgePoint
                      ])
                    } else {
                      debugPoints.push(otherTriangleEdgeSegment[1]);
                      newSegments2dForOtherTriangle.push([
                        intersectionPoint,
                        otherTriangleEdgeSegment[1],
                      ]);
                      newSegments3dForOtherTriangle.push([
                        otherEdgePoint,
                        otherTriangleEdgeSegment3d[1],
                      ]);
                    }
                  }
                } else {
                  const currentTrianglePoint0Side = pointSideOfSegment(otherTriangleEdgeSegment[0], otherTriangleEdgeSegment[1], currentTriangleEdgeSegment[0]);
                  const currentTrianglePoint1Side = pointSideOfSegment(otherTriangleEdgeSegment[0], otherTriangleEdgeSegment[1], currentTriangleEdgeSegment[1]);
                  if (currentTrianglePoint0Side === currentTrianglePoint1Side) {
                    // console.log("same")
                  } else {
                    if (currentTrianglePoint0Side === 'left') {
                      debugPoints.push(currentTriangleEdgeSegment[0]);
                      newSegments2dForCurrentTriangle.push([
                        currentTriangleEdgeSegment[0],
                        intersectionPoint,
                      ]);
                      newSegments3dForCurrentTriangle.push([
                        currentTriangleEdgeSegment3d[0],
                        currentEdgePoint,
                      ]);
                    } else {
                      debugPoints.push(currentTriangleEdgeSegment[1]);
                      newSegments2dForCurrentTriangle.push([
                        intersectionPoint,
                        currentTriangleEdgeSegment[1],
                      ]);
                      newSegments3dForCurrentTriangle.push([
                        currentEdgePoint,
                        currentTriangleEdgeSegment3d[1],
                      ]);
                    }
                  }
                }
              }
            }

            console.assert(newSegments2dForOtherTriangle.length === newSegments3dForOtherTriangle.length)

            if (newSegments2dForOtherTriangle.length) {
              if (!touched[otherTriangleEdgeIndex]) {
                OTHER_TRIANGLE_NEW_DATA.edges[otherTriangleEdgeIndex].edgeSegments2d = newSegments2dForOtherTriangle;
                OTHER_TRIANGLE_NEW_DATA.edges[otherTriangleEdgeIndex].edgeSegments3d = newSegments3dForOtherTriangle;
                touched[otherTriangleEdgeIndex] = true;
              } else {
                OTHER_TRIANGLE_NEW_DATA.edges[otherTriangleEdgeIndex].edgeSegments2d.push(...newSegments2dForOtherTriangle);
                OTHER_TRIANGLE_NEW_DATA.edges[otherTriangleEdgeIndex].edgeSegments3d.push(...newSegments3dForOtherTriangle);
              }
            }
          }
        }
        if (newSegments2dForCurrentTriangle.length) {
          CURRENT_TRIANGLE_NEW_DATA.edges[currentTriangleEdgeIndex].edgeSegments2d = newSegments2dForCurrentTriangle;
          CURRENT_TRIANGLE_NEW_DATA.edges[currentTriangleEdgeIndex].edgeSegments3d = newSegments3dForCurrentTriangle;
        }
      }
      nextProcessedTriangles.push(OTHER_TRIANGLE_NEW_DATA);
    }

    processedTriangles = [...nextProcessedTriangles, CURRENT_TRIANGLE_NEW_DATA];

    p.triangles++;
    const nextProgress = t / (triangles.length * (triangles.length + 1) / 2) * 100;
    p.iterationsProgress = nextProgress;
    if (nextProgress - prevProgress > 1) {
      await new Promise(resolve => setTimeout(resolve));
      callback(p)
      prevProgress = nextProgress;
    }
  }

  p.triangles = p.maxTriangles;
  p.iterationsProgress = 100;
  callback(p);

  return {
    triangles: removeDullEdges(processedTriangles),
    debugLines: [],
    debugPoints,
  }
}
