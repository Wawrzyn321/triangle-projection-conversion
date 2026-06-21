import { Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export function Tip({ hasModel }: { hasModel: boolean }) {
  const [hasEverHadModel, setHasEverHadModel] = useState(false);

  useEffect(() => {
    if (hasModel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasEverHadModel(true);
    }
  }, [hasModel]);

  if (!hasEverHadModel) {
    return null;
  }

  return (
    <Text fontWeight="light" fontStyle="italic" margin={1}>
      Tip: For best results, make the model fill the viewport. The physical size
      will remain unchanged.
    </Text>
  );
}
