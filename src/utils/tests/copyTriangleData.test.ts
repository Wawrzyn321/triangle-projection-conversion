import * as THREE from 'three';
import { ProcessedTriangleData } from "../../types"
import { copyTriangleData } from '../copyTriangleData';

const makeTriangle = () => {
    const vert1 = new THREE.Vector3(0, 0, 0);
    const vert2 = new THREE.Vector3(3, 0, 0);

    const triangle: ProcessedTriangleData = {
        edges: [
            {
                start: vert1,
                end: vert2,
                edgeSegments: [[new THREE.Vector2(0, 0), new THREE.Vector2(3, 0)]],
            }
        ]
    }
    return triangle;
}

describe('copyTriangleData', () => {
    it('copied obj is equal', () => {
        const triangle = makeTriangle();

        const copy = copyTriangleData(triangle);

        expect(triangle).toEqual(copy);
    })

    it('copied obj has different references', () => {
        const triangle = makeTriangle();

        const copy = copyTriangleData(triangle);

        expect(triangle).not.toBe(copy);
        expect(triangle.edges).not.toBe(copy.edges);
        for (let i = 0; i < triangle.edges.length; i++) {
            expect(triangle.edges[i].start).not.toBe(copy.edges[i].start)
            expect(triangle.edges[i].end).not.toBe(copy.edges[i].end)
            expect(triangle.edges[i].edgeSegments).not.toBe(copy.edges[i].edgeSegments)
            for (let j = 0; j < triangle.edges[i].edgeSegments.length; j++) {
                expect(triangle.edges[i].edgeSegments[j]).not.toBe(copy.edges[i].edgeSegments[j])
                for (let k = 0; k < triangle.edges[i].edgeSegments[j].length; k++) {
                    expect(triangle.edges[i].edgeSegments[j][k]).not.toBe(copy.edges[i].edgeSegments[j][k])
                }
            }
        }
    })
})