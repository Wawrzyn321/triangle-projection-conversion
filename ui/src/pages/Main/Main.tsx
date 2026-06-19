import { useState } from 'react';
import { Area2d } from './Area2d/Area2d';
import { Area3d } from './Area3d/Area3d';
import { MainLayout } from './MainLayout';
import type { AlgoReturn } from './types';

export function Main() {
  const [result, setResult] = useState<AlgoReturn | null>(null);

  return (
    <MainLayout>
      <Area3d setResult={setResult} />
      <Area2d result={result} />
    </MainLayout>
  );
}
