import { Flex } from '@chakra-ui/react';

export const SIZE_PRESETS = (
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

export type SizePreset = (typeof SIZE_PRESETS)[number];

type Props = {
  size: SizePreset;
  setSize(size: SizePreset): void;
};

export function PaperSizeSelect({ size, setSize }: Props) {
  return (
    <Flex padding={1}>
      <select
        name="paper-size"
        onChange={e =>
          setSize(SIZE_PRESETS.find(preset => preset.name === e.target.value)!)
        }
        value={size.name}
      >
        {SIZE_PRESETS.map(preset => (
          <option key={preset.name} value={preset.name}>
            {preset.name} ({preset.height} x {preset.width}mm)
          </option>
        ))}
      </select>
    </Flex>
  );
}
