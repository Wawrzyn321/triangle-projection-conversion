import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export async function loadGeometryFromFile(file: File) {
  const data = await file.arrayBuffer();

  const loader = new STLLoader();
  const geometry = loader.parse(data);
  geometry.center();

  return geometry;
}
