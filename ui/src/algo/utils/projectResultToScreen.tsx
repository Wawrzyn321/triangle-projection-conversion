import * as THREE from 'three';
import type { AlgoReturn } from '@/pages/Main/types';

export function projectResultToScreen(
  algoReturn: AlgoReturn,
  domElementSize: THREE.Vector2,
): AlgoReturn {
  const projectionToScreenBound = (point: THREE.Vector2) => {
    return projectionToScreen(point, domElementSize);
  };

  return {
    triangles: algoReturn.triangles.map(triangle => ({
      edges: triangle.edges.map(({ edgeSegments2d, ...rest }) => ({
        ...rest,
        edgeSegments2d: edgeSegments2d.map(segment =>
          segment.map(projectionToScreenBound),
        ),
      })),
    })),
    debugLines: algoReturn.debugLines.map(segment =>
      segment.map(projectionToScreenBound),
    ),
    debugPoints: algoReturn.debugPoints.map(projectionToScreenBound),
  };
}

export function projectionToScreen(
  pos: THREE.Vector2,
  domElementSize: THREE.Vector2,
) {
  const widthHalf = domElementSize.width / 2;
  const heightHalf = domElementSize.height / 2;

  return new THREE.Vector2(
    pos.x * widthHalf + widthHalf,
    -pos.y * heightHalf + heightHalf,
  );
}
