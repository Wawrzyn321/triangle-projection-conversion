import { Text } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export function Heading({ children }: PropsWithChildren) {
  return (
    <Text as="h2" fontWeight="bolder" fontSize="xl">
      {children}
    </Text>
  );
}
