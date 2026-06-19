import { colors } from '@/colors';
import { Flex, Text } from '@chakra-ui/react';

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
      background={`linear-gradient(180deg, ${colors.BACKGROUND_ACCENT}, ${colors.BACKGROUND})`}
    >
      <Text fontStyle='italic'>Summer 2026</Text>
    </Flex>
  );
}
