import { Button, Group, IconButton, Menu, Portal } from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';
import { downloadFile } from './../utils/downloadFile';
import { createSvg } from './../utils/createSvg';

import type { PaperFormat } from './../components/PaperSizeSelect';
import type { AlgoReturnWithName } from '../../Area3d/types';
import { createAndSavePdf } from './../utils/createAndSavePdf';

type Props = {
  result: AlgoReturnWithName | null;
  format: PaperFormat['name'];
};

export function Export({ result, format }: Props) {
  const menuItems = [
    {
      label: '.pdf',
      value: 'pdf',
      handleClick: async () => {
        if (!result) return;

        await createAndSavePdf(result, format);
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
