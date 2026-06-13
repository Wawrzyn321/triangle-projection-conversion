import { colors } from '@/colors';
import { Flex } from '@chakra-ui/react';

const FOOTER_HEIGHT = '60px';

export function Footer() {
  return (
    <Flex
      w="100%"
      alignItems="center"
      marginTop="auto"
      as="footer"
      height={FOOTER_HEIGHT}
      justify="center"
      background={`linear-gradient(180deg, ${colors.BACKGROUND_GRADIENT}, ${colors.BACKGROUND})`}
    >
      IDK this is footer
    </Flex>
  );
}
