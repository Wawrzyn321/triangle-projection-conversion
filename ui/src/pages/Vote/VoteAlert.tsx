import { Alert } from '@chakra-ui/react';
import { useColors } from '@/shared/useColors';

export function VoteAlert() {
  const colors = useColors();
  return (
    <Alert.Root backgroundColor={colors.PRIMARY} color={colors.BACKGROUND}>
      <Alert.Indicator color={colors.WHITE} />
      <Alert.Content>
        <Alert.Title color={colors.WHITE}>
          Thank you for casting your vote, it helps me with priorities!
        </Alert.Title>
      </Alert.Content>
    </Alert.Root>
  );
}
