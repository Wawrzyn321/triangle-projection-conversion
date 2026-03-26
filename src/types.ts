
import * as THREE from 'three'

export type TriangleEdge = {
    start: THREE.Vector3;
    end: THREE.Vector3;
}

export type Segment = THREE.Vector2[];

export type ProcessedTriangleEdge = TriangleEdge & {
    edgeSegments: Segment[];
    // wywal
    originalProjectedStart: THREE.Vector2;
}

export type TriangleData = TriangleEdge[];

export type ProcessedTriangleData = ProcessedTriangleEdge[];

export type AlgoReturn = {
    processedTriangleData: ProcessedTriangleData[];
    debugLines: Segment[];
    debugPoints: THREE.Vector2[];
}