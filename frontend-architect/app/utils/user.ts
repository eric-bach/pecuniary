import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

export function useMatchesData(id: string): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(() => matchingRoutes.find((route) => route.id === id), [matchingRoutes, id]);
  return route?.data;
}

function isUser(user: any) {
  return user && typeof user === 'object'; // && typeof user.email === 'string';
}

export function useOptionalUser(): any | undefined {
  const data = useMatchesData('root');

  console.log('data', data);
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}
