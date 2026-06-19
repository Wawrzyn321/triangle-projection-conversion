import type { FEATURES } from './FEATURES';
import { Button, Flex, ListItem, Text } from '@chakra-ui/react';
import { colors } from '@/colors';

type Props = {
  feature: (typeof FEATURES)[number];
  disabled: boolean;
  handleVote: (vote: (typeof FEATURES)[number]['key']) => void;
};

export function VoteOption({ feature, handleVote, disabled }: Props) {
  return (
    <ListItem key={feature.key}>
      <Text fontSize="lg">{feature.name}</Text>
      <Text fontWeight="lighter">{feature.description}</Text>
      <Flex justify="end">
        <Button
          backgroundColor={colors.PRIMARY}
          disabled={disabled}
          onClick={() => handleVote(feature.key)}
          height="32px"
        >
          Vote
        </Button>
      </Flex>
    </ListItem>
  );
}
