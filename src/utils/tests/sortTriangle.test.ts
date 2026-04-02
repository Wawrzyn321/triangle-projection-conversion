import * as THREE from 'three'
import { TriangleData, TriangleEdge } from "../../types"
import { mapInitialTriangles } from '../mapInitialTriangles';
import { sortTriangle } from '../sortTriangle';

const vert1 = new THREE.Vector3(-1, -1, 0);
const vert2 = new THREE.Vector3(0, 1, 0);
const vert3 = new THREE.Vector3(1, 0, 0);

const vert1_2d = new THREE.Vector2(vert1.x, vert1.y);
const vert2_2d = new THREE.Vector2(vert2.x, vert2.y);
const vert3_2d = new THREE.Vector2(vert3.x, vert3.y);

const clockwiseTriangle: TriangleData = {
    edges: [
        {
            start: vert1,
            end: vert2,
            edgeSegments2d: [[vert1_2d, vert2_2d]],
        },
        {
            start: vert2,
            end: vert3,
            edgeSegments2d: [[vert2_2d, vert3_2d]],
        },
        {
            start: vert3,
            end: vert1,
            edgeSegments2d: [[vert3_2d, vert1_2d]]
        }
    ]
}


const counterclockwiseTriangle: TriangleData = {
    edges: [
        {
            start: vert1,
            end: vert3,
            edgeSegments2d: [[vert1_2d, vert3_2d]],
        },
        {
            start: vert3,
            end: vert2,
            edgeSegments2d: [[vert3_2d, vert2_2d]],
        },
        {
            start: vert2,
            end: vert1,
            edgeSegments2d: [[vert2_2d, vert1_2d]]
        }
    ]
}

describe('sortTriangle', () => {
    it('sanity check with mapInitialTriangles - clockwise', () => {
        const sanityCheck = mapInitialTriangles([[-1, -1, 0, 0, 1, 0, 1, 0, 0]], pos => new THREE.Vector2(pos.x, pos.y));
        expect(sanityCheck[0].edges).toEqual(clockwiseTriangle.edges)
    })

    it('sanity check with mapInitialTriangles - counterclockwise', () => {
        const sanityCheck = mapInitialTriangles([[-1, -1, 0, 1, 0, 0, 0, 1, 0]], pos => new THREE.Vector2(pos.x, pos.y));
        expect(sanityCheck[0].edges).toEqual(counterclockwiseTriangle.edges)
    })

    it('leaves the clockwise triangle be', () => {
        expect(sortTriangle(clockwiseTriangle)).toEqual(clockwiseTriangle);
    })

    it('changes anticlockwise triangle', () => {
        const validateEdge = (edge: TriangleEdge) => {
            expect(edge.edgeSegments2d).toHaveLength(1);
            expect(edge.edgeSegments2d[0]).toHaveLength(2);
            expect(edge.start.x).toEqual(edge.edgeSegments2d[0][0].x)
            expect(edge.start.y).toEqual(edge.edgeSegments2d[0][0].y)
            expect(edge.end.x).toEqual(edge.edgeSegments2d[0][1].x)
            expect(edge.end.y).toEqual(edge.edgeSegments2d[0][1].y)
        }

        const sorted = sortTriangle(counterclockwiseTriangle);

        expect(sorted).not.toEqual(clockwiseTriangle);

        expect(sorted.edges[0].start).toEqual(sorted.edges[2].end);
        expect(sorted.edges[1].start).toEqual(sorted.edges[0].end);
        expect(sorted.edges[2].start).toEqual(sorted.edges[1].end);

        validateEdge(sorted.edges[0])
        validateEdge(sorted.edges[1])
        validateEdge(sorted.edges[2])
    })
})