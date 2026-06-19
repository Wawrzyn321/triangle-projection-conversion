import { AspectRatio } from '@chakra-ui/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { AlgoReturn } from '../types';
import { drawFromSegments } from '@/algo/utils/canvasHelpers';
import { useColors } from '@/colors';
import {
  PaperSizeSelect,
  SIZE_PRESETS,
  type SizePreset,
} from './PaperSizeSelect';
import { Translator } from './Translator';

type Props = {
  result: AlgoReturn | null;
};

export function Area2d({ result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<SizePreset>(SIZE_PRESETS[0]);
  const colors = useColors();
  const [shift, setShift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (result) {
      drawFromSegments(canvasRef.current, result);
      setShift({ x: 0, y: 0 });
    }
  }, [result, size]);

  const canvasStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    transform: `translate(${shift.x}px, ${shift.y}px)`
  };

  return (
    <div id="area-2d-layout-receiver">
      <AspectRatio
        border="1px solid black"
        w="100%"
        ratio={Math.SQRT1_2}
        margin={[undefined, '0 auto']}
        backgroundColor={colors.PAPER}
      >
        <div id="aspect-ratio-receiver">
          <Translator setShift={setShift}>
            <canvas
              width={size.width}
              height={size.height}
              ref={canvasRef}
              style={canvasStyle}
            ></canvas>
          </Translator>
        </div>
      </AspectRatio>
      <PaperSizeSelect size={size} setSize={setSize} />
    </div>
  );
}
