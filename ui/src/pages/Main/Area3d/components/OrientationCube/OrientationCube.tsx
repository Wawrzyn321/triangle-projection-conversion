import ViewCubeController from '@/vendor/three-viewcube';
import type { RefObject } from 'react';
import './OrientationCube.css';

type Props = {
  vcControllerRef: RefObject<ViewCubeController | null>;
  cubeRef: RefObject<HTMLDivElement | null>;
};

export function OrientationCube({ vcControllerRef, cubeRef }: Props) {
  return (
    <div id="viewcube-container">
      <div className="cube" ref={cubeRef}>
        {Object.values(ViewCubeController.CubeOrientation).map(orientation => (
          <div
            key={orientation}
            className={`cube__face cube__face--${orientation}`}
            onClick={() => {
              if (vcControllerRef.current) {
                vcControllerRef.current.tweenCamera(
                  ViewCubeController.ORIENTATIONS[orientation],
                );
              }
            }}
          >
            {orientation}
          </div>
        ))}
      </div>
    </div>
  );
}
