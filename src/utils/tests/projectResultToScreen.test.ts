import * as THREE from 'three'
import { AlgoReturn } from "../../types";
import { projectResultToScreen } from "../projectResultToScreen";

describe('projectResultToScreen', () => {
    it('projects', () => {
        const algoReturn: AlgoReturn = {
            debugLines: [[new THREE.Vector2(0, 0), new THREE.Vector2(5, 5)]],
            debugPoints: [new THREE.Vector2(1, 1)],
            triangles: [{
                edges: [{
                    start: new THREE.Vector3(1,1,1),
                    end: new THREE.Vector3(2,2,2),
                    edgeSegments2d: [
                        [
                            new THREE.Vector2(1,1),
                            new THREE.Vector2(0.5,0.5),
                        ],
                        [
                            new THREE.Vector2(1.5,1.5),
                            new THREE.Vector2(2,2),
                        ]
                    ]
                }]
            }]
        }

        const result = projectResultToScreen(algoReturn, new THREE.Vector2(10, 10));

        expect(result.debugLines).toMatchInlineSnapshot(`
Array [
  Array [
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
Array [
  Vector2 {
    "x": 10,
    "y": 0,
  },
]
`);
        expect(result.triangles).toMatchInlineSnapshot(`
Array [
  Object {
    "edges": Array [
      Object {
        "edgeSegments2d": Array [
          Array [
            Vector2 {
              "x": 10,
              "y": 0,
            },
            Vector2 {
              "x": 7.5,
              "y": 2.5,
            },
          ],
          Array [
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
    })
})