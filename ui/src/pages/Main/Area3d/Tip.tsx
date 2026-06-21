import { Text } from '@chakra-ui/react';
import { useRef } from 'react';

export function Tip({ hasModel }: { hasModel: boolean; }) {
  const hasModelRef = useRef(false);

  if (hasModel) {
    hasModelRef.current = true;
  }

  if (!hasModelRef.current) {
    return null;
  }

  return <Text fontWeight="light" fontStyle="italic" margin={1}>
    Tip: For best results, make the model fill the viewport. The physical
    size will remain unchanged.
  </Text>;
}
