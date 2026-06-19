import { HStack, Progress as ChakraProgress } from '@chakra-ui/react';
import type { ProgressData } from '../../types';
import { useColors } from '@/colors';

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
        <ChakraProgress.Label>
          {triangles} / {maxTriangles}
        </ChakraProgress.Label>
        <ChakraProgress.Track backgroundColor={colors.TERTIARY} flex="1">
          <ChakraProgress.Range backgroundColor={colors.PRIMARY} />
        </ChakraProgress.Track>
        <ChakraProgress.ValueText>
          {iterationsProgress.toFixed(2)}%
        </ChakraProgress.ValueText>
      </HStack>
    </ChakraProgress.Root>
  );
}
