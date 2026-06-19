import { Alert } from '@chakra-ui/react';
import { colors } from '@/colors';

export function VoteAlert() {
  return (
    <Alert.Root backgroundColor={colors.PRIMARY} color={colors.BACKGROUND}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>
          Thank you for casting your vote, it helps me with priorities!
        </Alert.Title>
      </Alert.Content>
    </Alert.Root>
  );
}
