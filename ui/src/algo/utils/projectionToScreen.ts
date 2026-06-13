import * as THREE from 'three';

export function projectionToScreen(
  pos: THREE.Vector2,
  domElementSize: THREE.Vector2,
) {
  const widthHalf = domElementSize.width / 2;
  const heightHalf = domElementSize.height / 2;

  return new THREE.Vector2(
    pos.x * widthHalf + widthHalf,
    -pos.y * heightHalf + heightHalf,
  );
}
