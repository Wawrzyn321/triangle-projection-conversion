import { useRef } from 'react';
import { Area2d } from './Area2d';
import { Area3d } from './Area3d/Area3d';
import { MainLayout } from './MainLayout';

export function Main() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <MainLayout>
      <Area3d canvasRef={canvasRef} />
      <Area2d canvasRef={canvasRef} />
    </MainLayout>
  );
}
