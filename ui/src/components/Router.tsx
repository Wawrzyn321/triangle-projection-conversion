import { Info } from '@/pages/Info/Info';
import { Main } from '@/pages/Main/Main';
import { Vote } from '@/pages/Vote/Vote';
import { useEffect } from 'react';

const CANONICAL = 'https://3d-projection-lab.com';

export function Router() {
  const { pathname } = window.location;

  useUpdateCanonicalLink(pathname);

  switch (pathname) {
    case '/info':
      return <Info />;
    case '/vote':
      return <Vote />;
    default:
      return <Main />;
  }
}

function useUpdateCanonicalLink(pathname: string) {
  useEffect(() => {
    const link =
      document.querySelector("link[rel='canonical']") ||
      document.head.appendChild(document.createElement('link'));

    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', CANONICAL + pathname);
  }, [pathname]);
}
