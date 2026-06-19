import { Text } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export function Paragraph({ children }: PropsWithChildren) {
  return <Text textIndent="1em">{children}</Text>;
}
