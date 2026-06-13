import * as THREE from 'three';
import { projectResultToScreen } from '../projectResultToScreen';
import type { AlgoReturn } from '@/pages/Main/types';

describe('projectResultToScreen', () => {
  it('projects', () => {
    const algoReturn: AlgoReturn = {
      debugLines: [[new THREE.Vector2(0, 0), new THREE.Vector2(5, 5)]],
      debugPoints: [new THREE.Vector2(1, 1)],
      triangles: [
        {
          edges: [
            {
              start: new THREE.Vector3(1, 1, 1),
              end: new THREE.Vector3(2, 2, 2),
              edgeSegments2d: [
                [new THREE.Vector2(1, 1), new THREE.Vector2(0.5, 0.5)],
                [new THREE.Vector2(1.5, 1.5), new THREE.Vector2(2, 2)],
              ],
              edgeSegments3d: [
                [new THREE.Vector3(1, 1, 1), new THREE.Vector3(0.5, 0.5, 1)],
                [new THREE.Vector3(1.5, 1.5, 2), new THREE.Vector3(2, 2, 2)],
              ],
            },
          ],
        },
      ],
    };

    const result = projectResultToScreen(algoReturn, new THREE.Vector2(10, 10));

    expect(result.debugLines).toMatchInlineSnapshot(`
      [
        [
          Vector2 {
            "x": 5,
            "y": 5,
          },
          Vector2 {
            "x": 30,
            "y": -20,
          },
        ],
      ]
    `);
    expect(result.debugPoints).toMatchInlineSnapshot(`
      [
        Vector2 {
          "x": 10,
          "y": 0,
        },
      ]
    `);
    expect(result.triangles).toMatchInlineSnapshot(`
      [
        {
          "edges": [
            {
              "edgeSegments2d": [
                [
                  Vector2 {
                    "x": 10,
                    "y": 0,
                  },
                  Vector2 {
                    "x": 7.5,
                    "y": 2.5,
                  },
                ],
                [
                  Vector2 {
                    "x": 12.5,
                    "y": -2.5,
                  },
                  Vector2 {
                    "x": 15,
                    "y": -5,
                  },
                ],
              ],
              "edgeSegments3d": [
                [
                  Vector3 {
                    "x": 1,
                    "y": 1,
                    "z": 1,
                  },
                  Vector3 {
                    "x": 0.5,
                    "y": 0.5,
                    "z": 1,
                  },
                ],
                [
                  Vector3 {
                    "x": 1.5,
                    "y": 1.5,
                    "z": 2,
                  },
                  Vector3 {
                    "x": 2,
                    "y": 2,
                    "z": 2,
                  },
                ],
              ],
              "end": Vector3 {
                "x": 2,
                "y": 2,
                "z": 2,
              },
              "start": Vector3 {
                "x": 1,
                "y": 1,
                "z": 1,
              },
            },
          ],
        },
      ]
    `);
  });
});
