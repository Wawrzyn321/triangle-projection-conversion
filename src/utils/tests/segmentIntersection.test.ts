import * as THREE from 'three';
import { segmentIntersection } from "../segmentIntersection";


describe('segmentIntersection', () => {
    it('true', () => {
        expect(segmentIntersection(
            new THREE.Vector2(-1, -1),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(-1, 0),
            new THREE.Vector2(1, 0),
        )).toMatchObject({ x: 0, y: 0 });
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