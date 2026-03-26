import * as THREE from 'three';

export const FIRST_TRIANGLE = [
    0.0, 2.0, 0.0,   // top
    -1.0, -1.0, 0.0,   // bottom left
    1.0, -1.0, 0.0    // bottom right
];


export const SECOND_TRIANGLE = [
  -2.0, 0.0, -1.0,   // top
  3.0, -1.0, -1.0,   // bottom left
  3.0, 1.0, -1.0    // bottom right
];
// export const SECOND_TRIANGLE = [
//     -2.0, 0.0, 1.0,   // top
//     3.0, -1.0, 1.0,   // bottom left
//     3.0, 1.0, 1.0    // bottom right
// ];

export const THIRD_TRIANGLE = [
    // -3.0, 5.0, -2.0,   // top
    -3.0, 1.0, -2.0,   // top
    2.0, -1.0, -2.0,   // bottom left
    1.0, 5.0, -2.0    // bottom right
];

export const FIRST_LINE: [THREE.Vector3, THREE.Vector3] = [
    new THREE.Vector3(-2, -2, -2),
    new THREE.Vector3(2, 2, 2),
];

export const SECOND_LINE: [THREE.Vector3, THREE.Vector3] = [
    new THREE.Vector3(-4, -6, -2),
    new THREE.Vector3(-1, 4, 5),
];