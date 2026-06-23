import { VStack } from '@chakra-ui/react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Router } from './Router';

export function PageLayout() {
  return (
    <VStack minH="100vh" rowGap={10}>
      <Header />
      <main>
        <Router />
      </main>
      <Footer />
    </VStack>
  );
}
