import * as THREE from 'three';
import { dihedralAngle } from '../dihedralAngle';

describe('dihedralAngle', () => {
  it('in one plane', () => {
    const a = new THREE.Vector3(0, 2, 5);
    const b = new THREE.Vector3(0, -2, 5);

    const c1 = new THREE.Vector3(-10, 0, 5);
    const c2 = new THREE.Vector3(5, 0, 5);

    expect(dihedralAngle(a, b, c1, c2)).toBe(Math.PI);
    expect(dihedralAngle(b, a, c2, c1)).toBe(Math.PI);
    expect(dihedralAngle(a, b, c2, c1)).toBe(Math.PI);
  });

  it('slightly upwards', () => {
    const a = new THREE.Vector3(0, 2, 5);
    const b = new THREE.Vector3(0, -2, 5);

    const c1 = new THREE.Vector3(-10, 0, 5);
    const c2 = new THREE.Vector3(5, 0, 6);

    expect(dihedralAngle(a, b, c1, c2)).toBeCloseTo(2.94);
  });

  it('90 degs', () => {
    const a = new THREE.Vector3(0, 2, 0);
    const b = new THREE.Vector3(0, -2, 0);

    const c1 = new THREE.Vector3(-10, 0, 0);
    const c2 = new THREE.Vector3(0, 0, 10);
    const c3 = new THREE.Vector3(0, 0, -10);

    expect(dihedralAngle(a, b, c1, c2)).toBe(Math.PI / 2);
    expect(dihedralAngle(a, b, c1, c3)).toBe(Math.PI / 2);
  });

  it('verts close', () => {
    const a = new THREE.Vector3(-2, 0, 0);
    const b = new THREE.Vector3(2, 0, 0);

    const c1 = new THREE.Vector3(0, 50, -1);
    const c2 = new THREE.Vector3(0, 50, 1);

    expect(dihedralAngle(a, b, c1, c2)).toBeCloseTo(0.04);
  });
});
