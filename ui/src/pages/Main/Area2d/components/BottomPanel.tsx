import { Flex } from '@chakra-ui/react';
import { PaperSizeSelect, type PaperFormat } from './PaperSizeSelect';
import type { AlgoReturnWithName } from '../../Area3d/types';
import { Export } from './Export';

type Props = {
  format: PaperFormat;
  setFormat(format: PaperFormat): void;
  result: AlgoReturnWithName | null;
};

export function BottomPanel({ format, setFormat, result }: Props) {
  return (
    <Flex justify="space-between" marginTop={1}>
      <PaperSizeSelect format={format} setFormat={setFormat} />
      <Export result={result} format={format.name} />
    </Flex>
  );
}
