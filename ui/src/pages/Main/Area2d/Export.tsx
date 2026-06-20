import { Button, Group, IconButton, Menu, Portal } from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';
import type { AlgoReturnWithName } from '../Area3d/types';
import { downloadFile } from './downloadFile';
import { createSvg } from './createSvg';

type Props = {
  result: AlgoReturnWithName | null;
};

export function Export({ result }: Props) {
  const menuItems = [
    {
      label: '.pdf',
      value: 'pdf',
      handleClick: () => {
        if (!result) return;
      },
    },
    {
      label: '.svg',
      value: 'svg',
      handleClick: () => {
        if (!result) return;

        const svg = createSvg(result);
        const name = `${result.fileName}.svg`;

        downloadFile(svg, name, 'image/svg+xml');
      },
    },
  ];

  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Group attached>
        <Button variant="outline" size="sm" disabled={!result}>
          Export
        </Button>
        <Menu.Trigger asChild disabled={!result}>
          <IconButton variant="outline" size="sm">
            <LuChevronDown />
          </IconButton>
        </Menu.Trigger>
      </Group>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {menuItems.map(item => (
              <Menu.Item
                key={item.value}
                value={item.value}
                onClick={item.handleClick}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
