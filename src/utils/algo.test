import * as THREE from 'three';
import { pointSideOfSegment, segmentIntersection, sortTriangle } from './algo';
import { ProcessedTriangleData } from './types';

jest.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    OrbitControls: jest.fn(),
}));

describe('algo', () => {
    describe('pointSideOfSegment', () => {
        it('right', () => {
            expect(pointSideOfSegment(
                new THREE.Vector2(0, 0),
                new THREE.Vector2(2, 0),
                new THREE.Vector2(1, -1))
            ).toBe('right')
        })

        it('left', () => {
            expect(pointSideOfSegment(
                new THREE.Vector2(0, 0),
                new THREE.Vector2(2, 0),
                new THREE.Vector2(1, 1))
            ).toBe('left')
        })

        it('colinear', () => {
            expect(pointSideOfSegment(
                new THREE.Vector2(0, 0),
                new THREE.Vector2(2, 0),
                new THREE.Vector2(2, 0))
            ).toBe('collinear')

            expect(pointSideOfSegment(
                new THREE.Vector2(0, 0),
                new THREE.Vector2(1, 0),
                new THREE.Vector2(2, 0))
            ).toBe('collinear')

            expect(pointSideOfSegment(
                new THREE.Vector2(0, 0),
                new THREE.Vector2(2, 0),
                new THREE.Vector2(0, 0))
            ).toBe('collinear')

            expect(pointSideOfSegment(
                new THREE.Vector2(0, 0),
                new THREE.Vector2(2, 0),
                new THREE.Vector2(1000, 0))
            ).toBe('collinear')
        })
    })

    describe('sortTriangle', () => {
        it('doesnt change if sorted', () => {
            const triangle: ProcessedTriangleData = [
                {
                    start: new THREE.Vector3(0, 0, 0),
                    end: new THREE.Vector3(1, 3, 0),
                    edgeSegments: [[
                        new THREE.Vector2(0, 0),
                        new THREE.Vector2(1, 3),
                    ]]
                },
                {
                    start: new THREE.Vector3(1, 3, 0),
                    end: new THREE.Vector3(2, 2, 0),
                    edgeSegments: [[
                        new THREE.Vector2(1, 3),
                        new THREE.Vector2(2, 2),
                    ]]
                },
                {
                    start: new THREE.Vector3(2, 2, 0),
                    end: new THREE.Vector3(0, 0, 0),
                    edgeSegments: [[
                        new THREE.Vector2(2, 2),
                        new THREE.Vector2(0, 0),
                    ]]
                }
            ]

            const result = sortTriangle(triangle);

            expect(result).toMatchObject(triangle)
        })

        it('sorts', () => {
            const triangle: ProcessedTriangleData = [
                {
                    start: new THREE.Vector3(0, 0, 0),
                    end: new THREE.Vector3(2, 2, 0),
                    edgeSegments: [[
                        new THREE.Vector2(0, 0),
                        new THREE.Vector2(2, 2),
                    ]]
                },
                {
                    start: new THREE.Vector3(2, 2, 0),
                    end: new THREE.Vector3(1, 3, 0),
                    edgeSegments: [[
                        new THREE.Vector2(2, 2),
                        new THREE.Vector2(1, 3),
                    ]]
                },
                {
                    start: new THREE.Vector3(1, 3, 0),
                    end: new THREE.Vector3(0, 0, 0),
                    edgeSegments: [[
                        new THREE.Vector2(1, 3),
                        new THREE.Vector2(0, 0),
                    ]]
                }
            ]

            const result = sortTriangle(triangle);

            expect(result).toMatchObject<ProcessedTriangleData>([
                {
                    start: new THREE.Vector3(2, 2, 0),
                    end: new THREE.Vector3(0, 0, 0),
                    edgeSegments: [[
                        new THREE.Vector2(2, 2),
                        new THREE.Vector2(0, 0),
                    ]]
                },
                {
                    start: new THREE.Vector3(0, 0, 0),
                    end: new THREE.Vector3(1, 3, 0),
                    edgeSegments: [[
                        new THREE.Vector2(0, 0),
                        new THREE.Vector2(1, 3),
                    ]]
                },
                {
                    start: new THREE.Vector3(1, 3, 0),
                    end: new THREE.Vector3(2, 2, 0),
                    edgeSegments: [[
                        new THREE.Vector2(1, 3),
                        new THREE.Vector2(2, 2),
                    ]]
                }
            ])
        })
    })

    describe('segmentIntersection', () => {
        it('true', () => {
            expect(segmentIntersection(
                new THREE.Vector2(-1, -1),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(-1, 0),
                new THREE.Vector2(1, 0),
            )).toMatchObject({x: 0, y: 0});
        })

        it('false', () => {
            expect(segmentIntersection(
                new THREE.Vector2(-1, -1),
                new THREE.Vector2(1, 1),
                new THREE.Vector2(2, 0),
                new THREE.Vector2(3, 0),
            )).toBe(null);
        })
    })
})