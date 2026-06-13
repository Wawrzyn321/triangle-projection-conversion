// const FIRST_TRIANGLE = [
//   0.0, 2.0, 0.0,   // top
//   -1.0, -1.0, 0.0,   // bottom left
//   1.0, -1.0, 0.0    // bottom right
// ];

// const SECOND_TRIANGLE = [
//   -2.0, 0.0, -1.0,   // top
//   3.0, -1.0, -1.0,   // bottom left
//   3.0, 1.0, -1.0    // bottom right
// ];

// const THIRD_TRIANGLE = [
//   // -3.0, 5.0, -2.0,   // top
//   -3.0, 1.0, -2.0,   // top
//   2.0, -1.0, -2.0,   // bottom left
//   1.0, 5.0, -2.0    // bottom right
// ];

// const TRIANGLES = [{
//   verts: FIRST_TRIANGLE,
//   color: 0x00ff00
// }, {
//   verts: SECOND_TRIANGLE,
//   color: 0x008888,
// }, {
//   verts: THIRD_TRIANGLE,
//   color: 0x888800
// }]

// function createTriangle(verts: number[], color: number) {
//   if (verts.length !== 9) throw Error("Invalid vert count " + verts.length)
//   const geometry = new THREE.BufferGeometry();

//   const vertices = new Float32Array(verts);

//   geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
//   geometry.computeVertexNormals(); // optional (for lighting)

//   // Material (2-sided)
//   const material = new THREE.MeshBasicMaterial({
//     color,
//     side: THREE.DoubleSide
//   });

//   // Mesh
//   const triangle = new THREE.Mesh(geometry, material);

//   return triangle;
// }

// TRIANGLES.forEach(triangle => scene.add(createTriangle(triangle.verts, triangle.color)));
