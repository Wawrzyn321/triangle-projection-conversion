import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { PageLayout } from './components/PageLayout';
import { ColorModeProvider } from './components/ui/color-mode';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        body: { value: 'Lato, sans-serif' },
        heading: { value: 'Lato, sans-serif' },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <PageLayout />
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>,
);
