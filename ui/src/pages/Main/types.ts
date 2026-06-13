import * as THREE from 'three';

export type Segment2d = THREE.Vector2[];
export type Segment3d = THREE.Vector3[];

export type TriangleEdge = {
  start: THREE.Vector3;
  end: THREE.Vector3;
  edgeSegments2d: Segment2d[];
  edgeSegments3d: Segment3d[];
};

export type TriangleData = {
  edges: TriangleEdge[];
};

export type AlgoReturn = {
  triangles: TriangleData[];
  debugLines: Segment2d[];
  debugPoints: THREE.Vector2[];
  // debugSpheres: THREE.Vector3[];
};

export type ProgressData = {
  triangles: number;
  maxTriangles: number;
  iterationsProgress: number;
};
