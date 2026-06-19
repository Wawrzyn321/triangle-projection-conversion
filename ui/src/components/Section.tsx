import { Flex } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export function Section({ children }: PropsWithChildren) {
  return (
    <Flex as="section" direction="column" gap={4}>
      {children}
    </Flex>
  );
}
