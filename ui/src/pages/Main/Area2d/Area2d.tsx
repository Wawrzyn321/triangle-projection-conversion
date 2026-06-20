import { AspectRatio } from '@chakra-ui/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { drawFromSegments } from '@/algo/utils/canvasHelpers';
import { useColors } from '@/colors';
import { SIZE_PRESETS, type SizePreset } from './PaperSizeSelect';
import { Translator } from './Translator';
import { BottomPanel } from './BottomPanel';
import type { AlgoReturnWithName } from '../Area3d/types';

type Props = {
  result: AlgoReturnWithName | null;
};

export function Area2d({ result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<SizePreset>(SIZE_PRESETS[1]);
  const colors = useColors();
  const [shift, setShift] = useState({ x: 0, y: 0 });

  const redraw = () => {
    if (!containerRef.current || !canvasRef.current || !result) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const displayW = containerRef.current.clientWidth;
    const displayH = containerRef.current.clientHeight;
    canvasRef.current.width = displayW * dpr;
    canvasRef.current.height = displayH * dpr;
    const scale = {
      x: (displayW * dpr) / size.width,
      y: (displayH * dpr) / Number(size.height),
    };
    drawFromSegments(canvasRef.current, result, scale);
  };

  useEffect(() => {
    if (result) {
      redraw();
      setShift({ x: 0, y: 0 });
    }
  }, [result, size]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const observer = new ResizeObserver(redraw);
      observer.observe(container);
      return () => observer.disconnect();
    }
  }, []);

  const canvasStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    transform: `translate(${shift.x}px, ${shift.y}px)`,
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
            <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
              <canvas ref={canvasRef} style={canvasStyle}></canvas>
            </div>
          </Translator>
        </div>
      </AspectRatio>
      <BottomPanel
        size={size}
        setSize={setSize}
        result={result}
        format={size.name}
      />
    </div>
  );
}
