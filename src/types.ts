
import * as THREE from 'three'

export type Segment2d = THREE.Vector2[];
export type Segment3d = THREE.Vector3[];

export type ProcessedTriangleEdge = {
    start: THREE.Vector3;
    end: THREE.Vector3;
    edgeSegments2d: Segment2d[];
}

export type ProcessedTriangleData = {
    edges: ProcessedTriangleEdge[];
}

export type AlgoReturn = {
    processedTriangleData: ProcessedTriangleData[];
    debugLines: Segment2d[];
    debugPoints: THREE.Vector2[];
}