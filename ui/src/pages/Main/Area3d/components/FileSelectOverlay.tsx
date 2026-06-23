import { useColors } from '@/useColors';
import { Center, Button, Text } from '@chakra-ui/react';
import React, {
  useRef,
  useState,
  type ChangeEvent,
  type ComponentRef,
} from 'react';
import { BOTTOM_BAR_HEIGHT } from '../const';

export function FileSelectOverlay({
  onModelLoad,
}: {
  onModelLoad: (file: File) => void;
}) {
  const colors = useColors();
  const fileInputRef = useRef<ComponentRef<'input'> | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleButtonClick() {
    fileInputRef.current?.click();
  }

  async function handleLoadModel(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    onModelLoad(e.target.files[0]);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onModelLoad(file);
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(true);
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  }

  const buttonBorder = dragOver
    ? `4px dashed ${colors.PRIMARY}`
    : `1px dashed ${colors.SECONDARY}`;

  return (
    <Center
      position="absolute"
      width="100%"
      height={`calc(100% - ${BOTTOM_BAR_HEIGHT})`}
      top="0"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Button
        onClick={handleButtonClick}
        display="flex"
        flexDir="column"
        background="none"
        color="black"
        paddingInline="20"
        paddingBlock="10"
        border={buttonBorder}
        borderRadius={15}
      >
        <Text fontSize="md" color={colors.BACKGROUND_INVERSE}>
          Select .stl file
        </Text>
        <Text
          fontSize="xs"
          color={colors.BACKGROUND_INVERSE}
          fontWeight="light"
        >
          Or drop the file here
        </Text>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleLoadModel}
        />
      </Button>
    </Center>
  );
}
