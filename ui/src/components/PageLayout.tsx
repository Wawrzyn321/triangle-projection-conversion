import { VStack } from '@chakra-ui/react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from '@/pages/Main/Main';
import { Info } from '@/pages/Info/Info';

export function PageLayout() {
  const renderMainPage = window.location.pathname !== '/info';

  return (
    <VStack minH="100vh" rowGap={10}>
      <Header />
      {renderMainPage ? <Main /> : <Info />}
      <Footer />
    </VStack>
  );
}
