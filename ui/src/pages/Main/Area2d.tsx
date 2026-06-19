import { AspectRatio, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import type { AlgoReturn } from './types';
import { drawFromSegments } from '@/algo/utils/canvasHelpers';
import { useColors } from '@/colors';

const SIZE_PRESETS = (
  [
    ['A3', 297],
    ['A4', 210],
    ['A5', 148],
  ] as const
).map(([name, width]) => ({
  name,
  height: (width * Math.SQRT2).toFixed(0),
  width,
}));

type Props = {
  result: AlgoReturn | null;
};

export function Area2d({ result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState('A4');
  const colors = useColors();

  const preset = SIZE_PRESETS.find(p => p.name === size)!;

  useEffect(() => {
    if (result) {
      drawFromSegments(canvasRef.current, result);
    }
  }, [result, size]);

  return (
    <div>
      <AspectRatio
        border="1px solid black"
        w="100%"
        ratio={Math.SQRT1_2}
        margin={[undefined, '0 auto']}
        backgroundColor={colors.PAPER}
      >
        <canvas
          width={preset.width}
          height={preset.height}
          ref={canvasRef}
        ></canvas>
      </AspectRatio>
      <Flex justify="space-between">
        {preset.height} x {preset.width}mm
        <select
          name="paper-size"
          onChange={e => setSize(e.target.value)}
          value={size}
        >
          {SIZE_PRESETS.map(preset => (
            <option key={preset.name}>{preset.name}</option>
          ))}
        </select>
      </Flex>
    </div>
  );
}
