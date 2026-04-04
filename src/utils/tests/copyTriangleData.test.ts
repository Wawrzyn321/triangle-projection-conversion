import * as THREE from 'three';
import { TriangleData } from "../../types"
import { copyTriangleData } from '../copyTriangleData';

const makeTriangle = () => {
    const vert1 = new THREE.Vector3(0, 0, 0);
    const vert2 = new THREE.Vector3(3, 0, 0);

    const triangle: TriangleData = {
        edges: [
            {
                start: vert1,
                end: vert2,
                edgeSegments2d: [[new THREE.Vector2(0, 0), new THREE.Vector2(3, 0)]],
                edgeSegments3d: [[vert1, vert2]],
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
            expect(triangle.edges[i].edgeSegments2d).not.toBe(copy.edges[i].edgeSegments2d)
            for (let j = 0; j < triangle.edges[i].edgeSegments2d.length; j++) {
                expect(triangle.edges[i].edgeSegments2d[j]).not.toBe(copy.edges[i].edgeSegments2d[j])
                for (let k = 0; k < triangle.edges[i].edgeSegments2d[j].length; k++) {
                    expect(triangle.edges[i].edgeSegments2d[j][k]).not.toBe(copy.edges[i].edgeSegments2d[j][k])
                    expect(triangle.edges[i].edgeSegments3d[j][k]).not.toBe(copy.edges[i].edgeSegments3d[j][k])
                }
            }
        }
    })
})