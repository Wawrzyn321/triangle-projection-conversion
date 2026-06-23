import { Flex } from '@chakra-ui/react';

export const PAPER_FORMAT_PRESETS = (
  [
    ['A3', 297],
    ['A4', 210],
    ['A5', 148],
  ] as const
).map(([name, width]) => ({
  name,
  height: (width * Math.SQRT2).toFixed(0),
  width,
}));

export type PaperFormat = (typeof PAPER_FORMAT_PRESETS)[number];

type Props = {
  format: PaperFormat;
  setFormat(format: PaperFormat): void;
};

export function PaperSizeSelect({ format, setFormat }: Props) {
  return (
    <Flex padding={1}>
      <select
        name="paper-size"
        onChange={e =>
          setFormat(
            PAPER_FORMAT_PRESETS.find(
              preset => preset.name === e.target.value,
            )!,
          )
        }
        value={format.name}
      >
        {PAPER_FORMAT_PRESETS.map(preset => (
          <option key={preset.name} value={preset.name}>
            {preset.name} ({preset.height} x {preset.width}mm)
          </option>
        ))}
      </select>
    </Flex>
  );
}
