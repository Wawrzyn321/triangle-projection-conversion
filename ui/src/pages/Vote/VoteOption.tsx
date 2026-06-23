import type { FEATURES } from './FEATURES';
import { Button, Flex, ListItem, Text } from '@chakra-ui/react';
import { useColors } from '@/useColors';

type Props = {
  feature: (typeof FEATURES)[number];
  disabled: boolean;
};

export function VoteOption({ feature, disabled }: Props) {
  const colors = useColors();
  return (
    <ListItem>
      <Text fontSize="lg">{feature.name}</Text>
      <Text fontWeight="lighter">{feature.description}</Text>
      <Flex justify="end">
        <Button
          name="vote"
          value={feature.key}
          backgroundColor={colors.PRIMARY}
          disabled={disabled}
          height="32px"
          type='submit'
          color={colors.WHITE}
        >
          Vote
        </Button>
      </Flex>
    </ListItem>
  );
}
