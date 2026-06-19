import { Flex } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export function Article({ children }: PropsWithChildren) {
  return (
    <Flex as="article" maxW="33em" direction="column" gap={8} marginInline={4}>
      {children}
    </Flex>
  );
}
