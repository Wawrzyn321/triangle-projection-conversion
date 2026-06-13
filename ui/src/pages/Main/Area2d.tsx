import { AspectRatio } from '@chakra-ui/react';
import type { RefObject } from 'react';

// const SIZE_PRESETS = (
//   [
//     ['A1', 594],
//     ['A2', 420],
//     ['A3', 297],
//     ['A4', 210],
//     ['A5', 148],
//   ] as const
// ).map(([name, height]) => ({ name, width: height * Math.SQRT2, height }));

export function Area2d({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}) {
  return (
    <AspectRatio
      border="1px solid black"
      w="100%"
      ratio={Math.SQRT1_2}
      margin={[undefined, '0 auto']}
    >
      <canvas ref={canvasRef}></canvas>
    </AspectRatio>
  );
}
