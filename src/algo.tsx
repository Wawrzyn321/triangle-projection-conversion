import * as THREE from 'three';
import { FIRST_TRIANGLE, SECOND_TRIANGLE, THIRD_TRIANGLE } from './triangles';
import { worldToScreen } from './sceneHelpers';
import { TriangleData, ProcessedTriangleData, AlgoReturn, Segment } from './types';
import { HEIGHT, WIDTH } from './App';

export async function algo(camera: THREE.Camera, renderer: THREE.WebGLRenderer, callback: (data: AlgoReturn) => Promise<void>): Promise<AlgoReturn> {
  const p_triangles: ProcessedTriangleData[] = [FIRST_TRIANGLE, SECOND_TRIANGLE
    , THIRD_TRIANGLE
  ].map(triangle => {
    const vert1 = new THREE.Vector3(triangle[0], triangle[1], triangle[2]);
    const vert2 = new THREE.Vector3(triangle[3], triangle[4], triangle[5]);
    const vert3 = new THREE.Vector3(triangle[6], triangle[7], triangle[8]);

    return [
      {
        start: vert1,
        end: vert2,
        edgeSegments: [
          [(worldToScreen(vert1, camera, renderer)),
          (worldToScreen(vert2, camera, renderer))]
        ],
      },
      {
        start: vert2,
        end: vert3,
        edgeSegments: [
          [(worldToScreen(vert2, camera, renderer)),
          (worldToScreen(vert3, camera, renderer))]
        ],
      },
      {
        start: vert3,
        end: vert1,
        edgeSegments: [
          [(worldToScreen(vert3, camera, renderer)),
          (worldToScreen(vert1, camera, renderer))
          ],]
      }
    ];
  });

  let processedTriangles: ProcessedTriangleData[] = [];
  const debugLines: Segment[] = [];
  const debugPoints: THREE.Vector2[] = [];

  const triangles = p_triangles
    .filter((triangle, triangleIndex) => {
      for (let otherIndex = 0; otherIndex < p_triangles.length; otherIndex++) {
        if (triangleIndex === otherIndex) continue;

        const inTriangle = (point: THREE.Vector2) => {
          return pointInTriangle(point,
            p_triangles[otherIndex][0].edgeSegments[0][0],
            p_triangles[otherIndex][1].edgeSegments[0][0],
            p_triangles[otherIndex][2].edgeSegments[0][0],
          )
        }

        if (inTriangle(triangle[0].edgeSegments[0][0]) &&
          inTriangle(triangle[1].edgeSegments[0][0]) &&
          inTriangle(triangle[2].edgeSegments[0][0])) {
          return false;
        }
      }
      return true;
    })

  for (const triangle of triangles) {
    const TEMP = sortTriangle(triangle);
    const currentTriangle = Object.freeze(TEMP);
    const CURRENT_TRIANGLE_NEW_DATA = copyTriangleData(TEMP)

    const nextProcessedTriangles: ProcessedTriangleData[] = []

    for (const otherTriangle of processedTriangles) {
      const OTHER_TRIANGLE_NEW_DATA = copyTriangleData(otherTriangle);
      const touched = [false, false, false]
      // intersections for other triangle
      console.assert(currentTriangle.length === 3);
      for (let currentTriangleEdgeIndex = 0; currentTriangleEdgeIndex < 3; currentTriangleEdgeIndex++) {
        const newSegmentsForCurrentTriangle: Segment[] = [];

        const currentTriangleEdge = currentTriangle[currentTriangleEdgeIndex];
        for (const currentTriangleEdgeSegment of currentTriangleEdge.edgeSegments) {
          console.assert(otherTriangle.length === 3);
          for (let otherTriangleEdgeIndex = 0; otherTriangleEdgeIndex < 3; otherTriangleEdgeIndex++) {
            const otherTriangleEdge = otherTriangle[otherTriangleEdgeIndex];
            const newSegmentsForOtherTriangle: Segment[] = [];
            for (const otherTriangleEdgeSegment of otherTriangleEdge.edgeSegments) {
              await callback({
                processedTriangleData: processedTriangles,
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

                // to może jebnąć
                // a) liczymy punkt pośrodku krawędzi, a nie tam gdzie jest przecięcie
                const midCurrentTriangleEdge = currentTriangleEdge.start.clone().add(currentTriangleEdge.end).divideScalar(2);
                const midOtherTriangleEdge = otherTriangleEdge.start.clone().add(otherTriangleEdge.end).divideScalar(2);
                const midCurrentTriangleEdgeCameraDistance2 = midCurrentTriangleEdge.clone().project(camera).z;
                const midOtherTriangleEdgeCameraDistance2 = midOtherTriangleEdge.clone().project(camera).z;
                let currentIsCloser = midCurrentTriangleEdgeCameraDistance2 < midOtherTriangleEdgeCameraDistance2;

                // ortho
                const ndc = new THREE.Vector3(intersectionPoint.x, intersectionPoint.y, 0.5); // z = 0.5 (mid depth)
                const P0 = ndc.unproject(camera); // w world space
                //todo dla perspective
                // const P0 = camera.position.clone();

                // const P1 = new THREE.Vector3(x, y, 0.5).unproject(camera);

                // const D = P1.sub(P0).normalize();

                // const cameraDir = new THREE.Vector3();
                // camera.getWorldDirection(cameraDir);

                // const P1 = intersectRayWithTriangle(P0, cameraDir, currentTriangle[0].start, currentTriangle[1].start, currentTriangle[2].start);
                // const P2 = intersectRayWithTriangle(P0, cameraDir, otherTriangle[0].start, otherTriangle[1].start, otherTriangle[2].start);

                // const D = camera.getWorldDirection(new THREE.Vector3()); // kierunek równoległy

                // if (P1 && P2) {
                //   const toP1 = new THREE.Vector3().subVectors(P1, camera.position);
                //   const toP2 = new THREE.Vector3().subVectors(P2, camera.position);

                //   const t1 = toP1.dot(D);
                //   const t2 = toP2.dot(D);

                //   currentIsCloser = t1 < t2;
                // }

                const i = intersection3d(camera,
                  [currentTriangleEdge.start, currentTriangleEdge.end],
                  [otherTriangleEdge.start, otherTriangleEdge.end]);
                console.log(i, currentIsCloser)

                if (i) {
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
                      // debugPoints.push(intersectionPoint.clone().lerp(otherTriangleEdgeSegment[0], 0.5));
                    } else {
                      debugPoints.push(otherTriangleEdgeSegment[1]);
                      newSegmentsForOtherTriangle.push([
                        intersectionPoint,
                        otherTriangleEdgeSegment[1],
                      ]);
                      // debugPoints.push(intersectionPoint.clone().lerp(otherTriangleEdgeSegment[1], 0.5))
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
                      // debugPoints.push(intersectionPoint.clone().lerp(currentTriangleEdgeSegment[0], 0.5))
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
                OTHER_TRIANGLE_NEW_DATA[otherTriangleEdgeIndex].edgeSegments = newSegmentsForOtherTriangle;
                touched[otherTriangleEdgeIndex] = true;
              } else {
                OTHER_TRIANGLE_NEW_DATA[otherTriangleEdgeIndex].edgeSegments.push(...newSegmentsForOtherTriangle);
              }
            }
          }
        }
        if (newSegmentsForCurrentTriangle.length) {
          CURRENT_TRIANGLE_NEW_DATA[currentTriangleEdgeIndex].edgeSegments = newSegmentsForCurrentTriangle;
        }
      }
      nextProcessedTriangles.push(OTHER_TRIANGLE_NEW_DATA);
      await callback({
        processedTriangleData: processedTriangles,
        debugLines,
        debugPoints,
      })
    }

    processedTriangles = [...nextProcessedTriangles, CURRENT_TRIANGLE_NEW_DATA]
    await callback({
      processedTriangleData: processedTriangles,
      debugLines,
      debugPoints,
    })
  }

  const processedTriangles2 = processedTriangles.map((triangle, triangleIndex) => {
    return triangle.map(edge => {
      return {
        ...edge,
        edgeSegments: edge.edgeSegments.filter(segment => {
          for (let i = 0; i < processedTriangles.length; i++) {
            if (i === triangleIndex) continue;

            const otherTriangle = processedTriangles[i];

            const isInTriangle = (point: THREE.Vector2) => {
              return pointInTriangle(
                point,
                worldToScreen(otherTriangle[0].start, camera, renderer),
                worldToScreen(otherTriangle[1].start, camera, renderer),
                worldToScreen(otherTriangle[2].start, camera, renderer),
              )
            }


            if (isInTriangle(segment[0]) && isInTriangle(segment[1])) {
              const segmentMid = edge.start.clone().add(edge.end).divideScalar(2);
              const triangleMid = triangle[0].start.clone().add(triangle[1].start).add(triangle[2].start).divideScalar(3);
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
      }
    })
  })

  return {
    processedTriangleData: processedTriangles2,
    debugLines,
    debugPoints,
  };
}

export function segmentIntersection(A: THREE.Vector2, B: THREE.Vector2, C: THREE.Vector2, D: THREE.Vector2, epsilon = 1e-6) {
  function det(a: THREE.Vector2, b: THREE.Vector2) {
    return a.x * b.y - a.y * b.x;
  }

  const r = new THREE.Vector2().subVectors(B, A);
  const s = new THREE.Vector2().subVectors(D, C);
  const diff = new THREE.Vector2().subVectors(C, A);

  const rxs = det(r, s);
  const qpxr = det(diff, r);

  // Parallel
  if (Math.abs(rxs) < epsilon) {

    // Collinear
    if (Math.abs(qpxr) < epsilon) {

      const rdotr = r.dot(r);
      const t0 = diff.dot(r) / rdotr;
      const t1 = t0 + s.dot(r) / rdotr;

      // Overlap test
      if (
        (t0 >= 0 && t0 <= 1) ||
        (t1 >= 0 && t1 <= 1) ||
        (t0 < 0 && t1 > 1) ||
        (t1 < 0 && t0 > 1)
      ) {
        // return midpoint of overlap (simple choice)
        return null
        // const t = Math.max(0, Math.min(1, (t0 + t1) * 0.5));
        // return new THREE.Vector2(
        //   A.x + r.x * t,
        //   A.y + r.y * t,
        // );
      }

      return null;
    }

    // Parallel non-intersecting
    return null;
  }

  const t = det(diff, s) / rxs;
  const u = det(diff, r) / rxs;

  if (
    t >= -epsilon && t <= 1 + epsilon &&
    u >= -epsilon && u <= 1 + epsilon
  ) {
    return new THREE.Vector2(
      A.x + t * r.x,
      A.y + t * r.y,
    );
  }

  return null;
}

export function pointSideOfSegment(A: THREE.Vector2, B: THREE.Vector2, P: THREE.Vector2) {
  const cross =
    (B.x - A.x) * (P.y - A.y) -
    (B.y - A.y) * (P.x - A.x);

  if (cross > 0) return "left";
  if (cross < 0) return "right";
  return "collinear";
}

export function sortTriangle(source: ProcessedTriangleData): ProcessedTriangleData {
  const [a, b, c] = source.map(e => e.edgeSegments[0][0]);

  const cross = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);

  if (cross > 0) {
    // Deep clone manually (preserves Vector2/Vector3)
    const clone: ProcessedTriangleData = source.map(edge => ({
      start: edge.start.clone(),
      end: edge.end.clone(),
      edgeSegments: edge.edgeSegments.map(segment =>
        segment.map(v => v.clone()),
      ),
    }));

    // Flip all edges
    for (let i = 0; i < 3; i++) {
      [clone[i].start, clone[i].end] = [clone[i].end, clone[i].start];
      [clone[i].edgeSegments[0][0], clone[i].edgeSegments[0][1]] =
        [clone[i].edgeSegments[0][1], clone[i].edgeSegments[0][0]];
    }

    // Swap edge order
    [clone[1], clone[2]] = [clone[2], clone[1]];

    return clone;
  }

  return source;
}

export function copyTriangleData(source: ProcessedTriangleData): ProcessedTriangleData {
  return source.map(edge => ({
    start: edge.start.clone(),
    end: edge.end.clone(),
    edgeSegments: edge.edgeSegments.map(segment =>
      segment.map(v => v.clone())
    )
  }));
}

function pointInTriangle(
  pt: THREE.Vector2,
  v1: THREE.Vector2,
  v2: THREE.Vector2,
  v3: THREE.Vector2
): boolean {

  function sign(p1: THREE.Vector2, p2: THREE.Vector2, p3: THREE.Vector2) {
    return (p1.x - p3.x) * (p2.y - p3.y) -
      (p2.x - p3.x) * (p1.y - p3.y);
  }

  const d1 = sign(pt, v1, v2);
  const d2 = sign(pt, v2, v3);
  const d3 = sign(pt, v3, v1);

  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(hasNeg && hasPos);
}

function intersectRayWithTriangle(P0: THREE.Vector3, D: THREE.Vector3, A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3, eps = 1e-4) {
  const AB = B.clone().sub(A);
  const AC = C.clone().sub(A);
  const N = AB.clone().cross(AC);

  const denom = N.dot(D);

  if (Math.abs(denom) < eps) {
    throw Error("ROWNLEGOEL")
  }

  const t = N.dot(A.clone().sub(P0)) / denom;

  const P = P0.clone().add(D.clone().multiplyScalar(t));

  // barycentric
  const v0 = B.clone().sub(A);
  const v1 = C.clone().sub(A);
  const v2 = P.clone().sub(A);

  const d00 = v0.dot(v0);
  const d01 = v0.dot(v1);
  const d11 = v1.dot(v1);
  const d20 = v2.dot(v0);
  const d21 = v2.dot(v1);

  const denom2 = d00 * d11 - d01 * d01;

  const v = (d11 * d20 - d01 * d21) / denom2;
  const w = (d00 * d21 - d01 * d20) / denom2;
  const u = 1 - v - w;

  if (u >= -eps && v >= -eps && w >= -eps) {
    return P; // trafienie (z tolerancją)
  }

  return null;
}


function intersection3d(camera: THREE.Camera, segmentA: [THREE.Vector3, THREE.Vector3], segmentB: [THREE.Vector3, THREE.Vector3]) {
  const D = new THREE.Vector3();
  camera.getWorldDirection(D);
  const z = D.clone().normalize(); // view direction

  // pick any vector not parallel to z
  const tmp = Math.abs(z.x) > 0.9
    ? new THREE.Vector3(0, 1, 0)
    : new THREE.Vector3(1, 0, 0);

  const x = new THREE.Vector3().crossVectors(tmp, z).normalize();
  const y = new THREE.Vector3().crossVectors(z, x).normalize();


  function project(p: THREE.Vector3) {
    return new THREE.Vector3(
      p.dot(x),
      p.dot(y),
      p.dot(z) // keep depth!
    );
  }

  function intersect2D(p: THREE.Vector3, p2: THREE.Vector3, q: THREE.Vector3, q2: THREE.Vector3) {
    const r = { x: p2.x - p.x, y: p2.y - p.y };
    const s = { x: q2.x - q.x, y: q2.y - q.y };

    const cross = (a: THREE.Vector2Like, b: THREE.Vector2Like) => a.x * b.y - a.y * b.x;

    const denom = cross(r, s);
    if (Math.abs(denom) < 1e-8) return null; // parallel

    const t = cross({ x: q.x - p.x, y: q.y - p.y }, s) / denom;
    const u = cross({ x: q.x - p.x, y: q.y - p.y }, r) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: p.x + t * r.x,
        y: p.y + t * r.y,
        t,
        u
      };
    }

    return null;
  }

  const A0p = project(segmentA[0])
  const A1p = project(segmentA[1])
  const B0p = project(segmentB[0])
  const B1p = project(segmentB[1])

  const intersection = (intersect2D(
    A0p,
    A1p,
    B0p,
    B1p,
  ))
  if (!intersection) {
    return null;
  } else {
    const zA = A0p.z + intersection.t * (A1p.z - A0p.z);
    const zB = B0p.z + intersection.u * (B1p.z - B0p.z);
    if (Math.abs(zA - zB) < 0.00001) {
      return null;
    } else if (zA < zB) {
      return true;
    } else {
      return false;
    }
  }

}