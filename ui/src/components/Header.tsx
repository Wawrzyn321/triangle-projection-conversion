import { colors } from '@/colors';
import { Image, Flex, Heading, Text, Link } from '@chakra-ui/react';

const HEADER_HEIGHT = '60px';
const HEADER_MAX_WIDTH = '900px';

export function Header() {
  return (
    <Flex
      as="header"
      w="100%"
      height={HEADER_HEIGHT}
      justify="center"
      background={`linear-gradient(0deg, ${colors.BACKGROUND_ACCENT}, ${colors.BACKGROUND})`}
    >
      <Flex
        paddingInline={3}
        align="center"
        width={`min(100%, ${HEADER_MAX_WIDTH})`}
        justify="space-between"
      >
        <Link href="/">
          <Heading display="inline">3D Projection lab</Heading>
          <Image src="/logo.svg" role="presentation" htmlWidth="40px" />
        </Link>
        <Flex gap={4}>
          <Link href="/info">
            <Text>How it works</Text>
          </Link>
          <Link href="/vote">
            <Text>Vote for features</Text>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
