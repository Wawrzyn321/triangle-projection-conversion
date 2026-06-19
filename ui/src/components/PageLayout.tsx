import { VStack } from '@chakra-ui/react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from '@/pages/Main/Main';
import { Info } from '@/pages/Info/Info';
import { Vote } from '@/pages/Vote/Vote';

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

function Router() {
  const { pathname } = window.location;

  switch (pathname) {
    case '/info':
      return <Info />;
    case '/vote':
      return <Vote />;
    default:
      return <Main />;
  }
}
