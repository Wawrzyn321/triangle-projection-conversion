import { mapInitialTriangles } from '../mapInitialTriangles';
import { worldToProjection } from '../worldToProjection';
import * as THREE from 'three';
import {
  frontCameraMatrix,
  rightCameraMatrix,
  skosCameraMatrix,
} from './testutils';

describe('mapInitialTriangles', () => {
  it('front', () => {
    const FIRST_VERT = [0, 0, 0];
    const SECOND_VERT = [3, 0, 0];
    const THIRD_VERT = [0, 3, 0];

    const projection = new THREE.Matrix4().makeOrthographic(
      -1,
      1,
      1,
      -1,
      0.1,
      100,
    );
    const viewProjection = new THREE.Matrix4().multiplyMatrices(
      projection,
      frontCameraMatrix(),
    );

    const worldToProjectionBound = (point: THREE.Vector3) => {
      return worldToProjection(point, viewProjection);
    };

    const result = mapInitialTriangles(
      [[...FIRST_VERT, ...SECOND_VERT, ...THIRD_VERT]],
      worldToProjectionBound,
    );

    expect(result).toHaveLength(1);

    const triangle = result[0];
    expect(triangle.edges).toHaveLength(3);

    expect(triangle.edges[0].start).toEqual(new THREE.Vector3(...FIRST_VERT));
    expect(triangle.edges[0].end).toEqual(new THREE.Vector3(...SECOND_VERT));

    expect(triangle.edges[1].start).toEqual(new THREE.Vector3(...SECOND_VERT));
    expect(triangle.edges[1].end).toEqual(new THREE.Vector3(...THIRD_VERT));

    expect(triangle.edges[2].start).toEqual(new THREE.Vector3(...THIRD_VERT));
    expect(triangle.edges[2].end).toEqual(new THREE.Vector3(...FIRST_VERT));

    expect(triangle.edges[0].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 0,
          "y": 0,
        },
        Vector2 {
          "x": 3,
          "y": 0,
        },
      ]
    `);

    expect(triangle.edges[1].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 3,
          "y": 0,
        },
        Vector2 {
          "x": 0,
          "y": 3,
        },
      ]
    `);

    expect(triangle.edges[2].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 0,
          "y": 3,
        },
        Vector2 {
          "x": 0,
          "y": 0,
        },
      ]
    `);
  });

  it('right', () => {
    const FIRST_VERT = [0, 0, 0];
    const SECOND_VERT = [3, 0, 0];
    const THIRD_VERT = [0, 3, 0];

    const projection = new THREE.Matrix4().makeOrthographic(
      -1,
      1,
      1,
      -1,
      0.1,
      100,
    );
    const viewProjection = new THREE.Matrix4().multiplyMatrices(
      projection,
      rightCameraMatrix(),
    );

    const worldToProjectionBound = (point: THREE.Vector3) => {
      return worldToProjection(point, viewProjection);
    };

    const result = mapInitialTriangles(
      [[...FIRST_VERT, ...SECOND_VERT, ...THIRD_VERT]],
      worldToProjectionBound,
    );

    expect(result).toHaveLength(1);

    expect(result[0].edges[0].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 0,
          "y": 0,
        },
        Vector2 {
          "x": 0,
          "y": 0,
        },
      ]
    `);

    expect(result[0].edges[1].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 0,
          "y": 0,
        },
        Vector2 {
          "x": 0,
          "y": 3,
        },
      ]
    `);

    expect(result[0].edges[2].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 0,
          "y": 3,
        },
        Vector2 {
          "x": 0,
          "y": 0,
        },
      ]
    `);
  });

  it('skos', () => {
    const FIRST_VERT = [0, 0, 0];
    const SECOND_VERT = [3, 0, 0];
    const THIRD_VERT = [0, 3, 0];

    const projection = new THREE.Matrix4().makeOrthographic(
      -1,
      1,
      1,
      -1,
      0.1,
      100,
    );
    const viewProjection = new THREE.Matrix4().multiplyMatrices(
      projection,
      skosCameraMatrix(),
    );

    const worldToProjectionBound = (point: THREE.Vector3) => {
      return worldToProjection(point, viewProjection);
    };

    const result = mapInitialTriangles(
      [[...FIRST_VERT, ...SECOND_VERT, ...THIRD_VERT]],
      worldToProjectionBound,
    );

    expect(result).toHaveLength(1);

    expect(result[0].edges[0].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 0,
          "y": 0,
        },
        Vector2 {
          "x": 2.121320343559643,
          "y": -1.2247448713915894,
        },
      ]
    `);

    expect(result[0].edges[1].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 2.121320343559643,
          "y": -1.2247448713915894,
        },
        Vector2 {
          "x": 0,
          "y": 2.4494897427831788,
        },
      ]
    `);

    expect(result[0].edges[2].edgeSegments2d[0]).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 0,
          "y": 2.4494897427831788,
        },
        Vector2 {
          "x": 0,
          "y": 0,
        },
      ]
    `);
  });
});
