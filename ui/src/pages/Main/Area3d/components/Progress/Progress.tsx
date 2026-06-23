import { HStack, Progress as ChakraProgress } from '@chakra-ui/react';
import type { ProgressData } from '../../../types';
import { useColors } from '@/shared/useColors';
import './Progress.css';

export function Progress({
  progressData,
}: {
  progressData: ProgressData | null;
}) {
  const colors = useColors();

  if (!progressData) return null;

  const { iterationsProgress, maxTriangles, triangles } = progressData;

  return (
    <ChakraProgress.Root
      paddingInline={5}
      size="lg"
      animated
      value={iterationsProgress}
      maxW="sm"
      width="100%"
    >
      <HStack gap="5">
        <ChakraProgress.Label whiteSpace="nowrap">
          {triangles} / {maxTriangles} tris
        </ChakraProgress.Label>
        <progress
          value={iterationsProgress}
          max={100}
          style={
            {
              '--progress-track-color': colors.TERTIARY,
              '--progress-value-color': colors.PRIMARY,
              width: '100%',
            } as React.CSSProperties
          }
        />

        {/* <ChakraProgress.Track backgroundColor={colors.TERTIARY} flex="1">
          <ChakraProgress.Range backgroundColor={colors.PRIMARY} />
        </ChakraProgress.Track> */}
        <ChakraProgress.ValueText>
          {iterationsProgress.toFixed(2)}%
        </ChakraProgress.ValueText>
      </HStack>
    </ChakraProgress.Root>
  );
}
