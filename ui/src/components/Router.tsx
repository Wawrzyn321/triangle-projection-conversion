import { Info } from '@/pages/Info/Info';
import { Main } from '@/pages/Main/Main';
import { Vote } from '@/pages/Vote/Vote';
import { useEffect } from 'react';

const CANONICAL = 'https://3d-projection-lab.com';

export function Router() {
  const { pathname } = window.location;

  useUpdateCanonicalLink(pathname);
  useUpdateDocumentTitle(pathname);
  useUpdateMetaDescription(pathname);

  switch (pathname) {
    case '/info':
      return <Info />;
    case '/vote':
      return <Vote />;
    default:
      return <Main />;
  }
}

function useUpdateDocumentTitle(pathname: string) {
  useEffect(() => {
    const title = (() => {
      switch (pathname) {
        case '/info':
          return '3D Projection Lab - how it works';
        case '/vote':
          return '3D Projection Lab - vote for new features';
        default:
          return '3D Projection Lab';
      }
    })();

    document.title = title;
  }, [pathname]);
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

function useUpdateMetaDescription(pathname: string) {
  useEffect(() => {
    const meta =
      document.querySelector("meta[name='description']") ||
      document.head.appendChild(
        Object.assign(document.createElement('meta'), { name: 'description' }),
      );

    const description = (() => {
      switch (pathname) {
        case '/info':
          return 'How the 3D to 2D projection algorithm works, usage guide, and limitations.';
        case '/vote':
          return 'Vote for upcoming features in 3D Projection Lab.';
        default:
          return 'Create accurate 2D projections of 3D STL meshes. Export to SVG or PDF.';
      }
    })();

    meta.setAttribute('content', description);
  }, [pathname]);
}
