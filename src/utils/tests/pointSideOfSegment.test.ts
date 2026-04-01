import * as THREE from 'three';
import { pointSideOfSegment } from "../pointSideOfSegment"

const LINE_START = new THREE.Vector2(-1, -1);
const LINE_END = new THREE.Vector2(1, 1);

describe('pointSideOfSegment', () => {
    it('right', () => {
        expect(pointSideOfSegment(LINE_START, LINE_END, new THREE.Vector2(1, -1))).toBe('right')
        expect(pointSideOfSegment(LINE_END, LINE_START, new THREE.Vector2(-1, 1))).toBe('right')
    })

    it('left', () => {
        expect(pointSideOfSegment(LINE_END, LINE_START, new THREE.Vector2(1, -1))).toBe('left')
        expect(pointSideOfSegment(LINE_START, LINE_END, new THREE.Vector2(-1, 1))).toBe('left')
    })

    it('collinear', () => {
        expect(pointSideOfSegment(LINE_END, LINE_START, new THREE.Vector2(0, 0))).toBe('collinear')
        expect(pointSideOfSegment(LINE_START, LINE_END, LINE_START)).toBe('collinear')
        expect(pointSideOfSegment(LINE_START, LINE_END, LINE_END)).toBe('collinear')
        expect(pointSideOfSegment(LINE_START, LINE_END, LINE_END.clone().multiplyScalar(5))).toBe('collinear')
    })
})