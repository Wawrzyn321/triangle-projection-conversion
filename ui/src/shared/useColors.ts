import { useTheme } from 'next-themes';
import { useMemo } from 'react';

export const DARK_COLORS = {
  BACKGROUND: 'rgb(40, 40, 40)',
  BACKGROUND_ACCENT: 'rgb(70, 70, 70)',
  BACKGROUND_INVERSE: 'rgb(255, 255, 255)',
};

const LIGHT_COLORS = {
  BACKGROUND: 'rgb(255, 255, 255)',
  BACKGROUND_ACCENT: 'rgb(237, 237, 237)',
  BACKGROUND_INVERSE: 'rgb(40, 40, 40)',
};

export function useColors() {
  const { resolvedTheme } = useTheme();

  return useMemo(
    () => ({
      ...(resolvedTheme === 'dark' ? DARK_COLORS : LIGHT_COLORS),
      TERTIARY: '#85B7EB',
      SECONDARY: '#378ADD',
      PRIMARY: '#185FA5',
      PAPER: '#fcfcf5',
      WHITE: 'white',
      theme: resolvedTheme,
    }),
    [resolvedTheme],
  );
}
