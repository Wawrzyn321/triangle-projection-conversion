import { Flex } from '@chakra-ui/react';
import { PaperSizeSelect, type SizePreset } from './PaperSizeSelect';
import { Export } from './Export';
import type { AlgoReturnWithName } from '../Area3d/types';

type Props = {
  size: SizePreset;
  setSize(size: SizePreset): void;
  result: AlgoReturnWithName | null;
  format: SizePreset['name'];
};

export function BottomPanel({ size, setSize, result, format }: Props) {
  return (
    <Flex justify="space-between" marginTop={1}>
      <PaperSizeSelect size={size} setSize={setSize} />
      <Export result={result} format={format} />
    </Flex>
  );
}
