// src/router.tsx
import { createRouter, Link } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>Not found!</p>
          <Link to='/'>Go home</Link>
        </div>
      );
    },
  });

  return router;
}
