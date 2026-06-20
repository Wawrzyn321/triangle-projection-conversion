import type { AlgoReturn, Segment2d } from './types';
import * as THREE from 'three';

export function* point2dIterator(data: AlgoReturn): Generator<THREE.Vector2> {
  for (const triangle of data.triangles) {
    for (const edge of triangle.edges) {
      for (const segment of edge.edgeSegments2d) {
        for (const point of segment) {
          yield point;
        }
      }
    }
  }
}

export function* segment2dIterator(data: AlgoReturn): Generator<Segment2d> {
  for (const triangle of data.triangles) {
    for (const edge of triangle.edges) {
      for (const segment of edge.edgeSegments2d) {
        yield segment;
      }
    }
  }
}
