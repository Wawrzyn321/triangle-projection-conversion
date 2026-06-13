import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { PageLayout } from './components/PageLayout';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <PageLayout />
    </ChakraProvider>
  </StrictMode>,
);
