import { Box, Center, Heading } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

const MAIN_MAX_WIDTH = '1600px';

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Box
        hideBelow="sm"
        display="grid"
        alignItems="center"
        w="100%"
        gapX={10}
        gapY={20}
        gridTemplateColumns={[undefined, '1fr', '2fr 1fr']}
        width={`min(90vw, ${MAIN_MAX_WIDTH})`}
      >
        {children}
      </Box>
      <Center hideFrom="sm">
        <Heading marginTop={20} size="md">
          Please use a larger screen :(
        </Heading>
      </Center>
    </>
  );
}
