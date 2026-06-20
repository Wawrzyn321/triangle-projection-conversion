import { Box } from '@chakra-ui/react';
import {
  useState,
  type PropsWithChildren,
  type MouseEvent,
  type Dispatch,
} from 'react';

type Props = PropsWithChildren<{
  setShift: Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
}>;

export function Translator({ setShift, children }: Props) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleMouseMove = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
  ) => {
    if (!mousePos) {
      return;
    }
    const { x, y } = getMousePosition(e);

    const delta = {
      x: x - mousePos.x,
      y: y - mousePos.y,
    };

    setShift(shift => ({
      x: shift.x + delta.x,
      y: shift.y + delta.y,
    }));

    setMousePos({ x, y });
  };

  return (
    <Box
      width="100%"
      height="100%"
      onMouseDown={e => setMousePos(getMousePosition(e))}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setMousePos(null)}
    >
      {children}
    </Box>
  );
}

function getMousePosition(
  e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
) {
  const rect = e.currentTarget.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
