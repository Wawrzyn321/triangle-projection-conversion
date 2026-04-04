import { buildProjectionLineFromMatrix } from "../../buildProjectionLineFromMatrix";
import { intersectProjectionLineWithSegment } from "../../intersectProjectionLineWithSegment";
import { segmentIntersection } from "../segmentIntersection";
import { worldToProjection } from "../worldToProjection";
import { frontCameraMatrix } from "./testutils"
import * as THREE from 'three';

const BOUNDS = 5;

describe('line', () => {
    it('case 1', () => {
        const line1 = [new THREE.Vector3(-1, -1, 0), new THREE.Vector3(1, 1, 5000)];
        const line2 = [new THREE.Vector3(1, -1, 0), new THREE.Vector3(-1, 1, 0)];

        const viewProjectionMatrix = frontCameraMatrix();

        const line1Projected = line1.map(point => worldToProjection(point, viewProjectionMatrix));
        const line2Projected = line2.map(point => worldToProjection(point, viewProjectionMatrix));

        expect(line1Projected).toEqual([new THREE.Vector2(-1, -1), new THREE.Vector2(1, 1)]);
        expect(line2Projected).toEqual([new THREE.Vector2(1, -1), new THREE.Vector2(-1, 1)]);

        const intersectionPoint = segmentIntersection(
            line1Projected[0],
            line1Projected[1],
            line2Projected[0],
            line2Projected[1]);

        expect(intersectionPoint).toBeTruthy();
        if (!intersectionPoint) throw Error()

        expect(intersectionPoint.x).toBeCloseTo(0);
        expect(intersectionPoint.y).toBeCloseTo(0);

        const intersectionPointNdc = intersectionPoint.clone().divideScalar(BOUNDS);

        const projectionLine = buildProjectionLineFromMatrix(
            intersectionPointNdc,
            viewProjectionMatrix
        );

        expect(projectionLine.direction).toEqual(new THREE.Vector3(0, 0, 1));
        expect(projectionLine.origin.x).toBeCloseTo(0);
        expect(projectionLine.origin.y).toBeCloseTo(0);
        expect(projectionLine.origin.z).toBe(-1);

        const line1Point = intersectProjectionLineWithSegment(projectionLine.origin, projectionLine.direction, line1);
        expect(line1Point).toEqual(new THREE.Vector3(0, 0, 2500))

        const line2Point = intersectProjectionLineWithSegment(projectionLine.origin, projectionLine.direction, line2);
        expect(line2Point).toEqual(new THREE.Vector3(0, 0, 0))
    })

    it('case 2', () => {
        const line1 = [new THREE.Vector3(-5, -5, 0), new THREE.Vector3(5, 5, 5)];
        const line2 = [new THREE.Vector3(3, 1, 0), new THREE.Vector3(-1, 2, 0)];

        const viewProjectionMatrix = frontCameraMatrix();

        const line1Projected = line1.map(point => worldToProjection(point, viewProjectionMatrix));
        const line2Projected = line2.map(point => worldToProjection(point, viewProjectionMatrix));

        expect(line1Projected).toEqual([new THREE.Vector2(-5, -5), new THREE.Vector2(5, 5)]);
        expect(line2Projected).toEqual([new THREE.Vector2(3, 1), new THREE.Vector2(-1, 2)]);

        const intersectionPoint = segmentIntersection(
            line1Projected[0],
            line1Projected[1],
            line2Projected[0],
            line2Projected[1]);

        expect(intersectionPoint).toBeTruthy();
        if (!intersectionPoint) throw Error()

        expect(intersectionPoint.x).toBeCloseTo(1.4);
        expect(intersectionPoint.y).toBeCloseTo(1.4);

        const intersectionPointNdc = intersectionPoint.clone().divideScalar(BOUNDS);

        const projectionLine = buildProjectionLineFromMatrix(
            intersectionPointNdc,
            viewProjectionMatrix
        );

        expect(projectionLine.direction).toEqual(new THREE.Vector3(0, 0, 1));
        expect(projectionLine.origin.x).toBeCloseTo(1.4 / 5);
        expect(projectionLine.origin.y).toBeCloseTo(1.4 / 5);
        expect(projectionLine.origin.z).toBe(-1);

        const line1Point = intersectProjectionLineWithSegment(projectionLine.origin, projectionLine.direction, line1);
        expect(line1Point).toMatchInlineSnapshot(`
Vector3 {
  "x": 0.2800000000000001,
  "y": 0.2800000000000001,
  "z": 2.64,
}
`);

        const line2Point = intersectProjectionLineWithSegment(projectionLine.origin, projectionLine.direction, line2);
        expect(line2Point).toMatchInlineSnapshot(`
Vector3 {
  "x": 0.2800000000000001,
  "y": 0.2800000000000001,
  "z": 0,
}
`);
    })
})
