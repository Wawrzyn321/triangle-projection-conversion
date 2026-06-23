import { AspectRatio } from '@chakra-ui/react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type CSSProperties,
} from 'react';
import { drawFromSegments, clearCanvas } from './utils/canvasHelpers';
import { useColors } from '@/shared/useColors';
import {
  PAPER_FORMAT_PRESETS,
  type PaperFormat,
} from './components/PaperSizeSelect';
import { Translator } from './components/Translator';
import { BottomPanel } from './components/BottomPanel';
import type { AlgoReturnWithName } from '../Area3d/types';

type Props = {
  result: AlgoReturnWithName | null;
};

export function Area2d({ result }: Props) {
  const canvasRef = useRef<ComponentRef<'canvas'> | null>(null);
  const containerRef = useRef<ComponentRef<'div'> | null>(null);
  const [format, setFormat] = useState<PaperFormat>(PAPER_FORMAT_PRESETS[1]);
  const colors = useColors();
  const [shift, setShift] = useState({ x: 0, y: 0 });

  const redraw = useCallback(() => {
    if (!containerRef.current || !canvasRef.current || !result) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const displayW = containerRef.current.clientWidth;
    const displayH = containerRef.current.clientHeight;
    canvasRef.current.width = displayW * dpr;
    canvasRef.current.height = displayH * dpr;
    const scale = {
      x: (displayW * dpr) / format.width,
      y: (displayH * dpr) / Number(format.height),
    };
    drawFromSegments(canvasRef.current, result, scale);
  }, [result, format]);

  useEffect(() => {
    if (result) {
      redraw();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShift({ x: 0, y: 0 });
    } else {
      clearCanvas(canvasRef.current);
    }
  }, [result, format, redraw]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const observer = new ResizeObserver(redraw);
      observer.observe(container);
      return () => observer.disconnect();
    }
  }, [redraw]);

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
          <Translator setShift={setShift} interactive={!!result}>
            <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
              <canvas ref={canvasRef} style={canvasStyle}></canvas>
            </div>
          </Translator>
        </div>
      </AspectRatio>
      <BottomPanel format={format} setFormat={setFormat} result={result} />
    </div>
  );
}
