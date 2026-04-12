import { RefObject } from 'react';
import * as THREE from 'three';
import { CameraAnimator } from './CameraAnimator';

export function CameraPresets({ animatorRef, objectRef }: { animatorRef: RefObject<CameraAnimator | null>; objectRef: RefObject<THREE.Mesh | null>; }) {
  return Object.keys(CameraAnimator.PRESETS).map(preset => <button key={preset} onClick={() => {
    animatorRef.current?.directAt(preset as keyof typeof CameraAnimator.PRESETS, objectRef.current?.position);
  }}>{preset.toUpperCase()}</button>);
}
