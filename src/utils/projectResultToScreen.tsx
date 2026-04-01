import * as THREE from 'three';
import { AlgoReturn } from './../types';
import { projectionToScreen } from './projectionToScreen';

export function projectResultToScreen(algoReturn: AlgoReturn, domElementSize: THREE.Vector2): AlgoReturn {
  const projectionToScreenBound = (point: THREE.Vector2) => {
    return projectionToScreen(point, domElementSize);
  };

  return {
    processedTriangleData: algoReturn.processedTriangleData.map(triangle => ({
      edges: triangle.edges.map(({ edgeSegments2d, ...rest }) => ({
        ...rest,
        edgeSegments2d: edgeSegments2d.map(segment => segment.map(projectionToScreenBound))
      }))
    })),
    debugLines: algoReturn.debugLines.map(segment => segment.map(projectionToScreenBound)),
    debugPoints: algoReturn.debugPoints.map(projectionToScreenBound),
  };

}
