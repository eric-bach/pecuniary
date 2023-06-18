import { createCookieSessionStorage, redirect } from '@remix-run/node';
export * from 'aws-appsync';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secrets: ['asdadasdasd'],
    secure: process.env.NODE_ENV === 'production',
  },
});

const USER_SESSION_KEY = 'userId';

export async function getSession(request: Request) {
  const cookie = request?.headers?.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function getUserSessionInfo(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  const userSessionInfo = session.get(USER_SESSION_KEY);
  return userSessionInfo;
}

export async function requireUserId(request: Request, redirectTo: string | null): Promise<string> {
  const userId = await getUserSessionInfo(request);

  if (!userId && redirectTo) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  return userId as any;
}

export async function createUserSession({ request, userInfo, redirectTo }: { request: Request; userInfo: any; redirectTo: string }) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userInfo);
  return redirect(redirectTo || '/dashboard', {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}

export async function logout(request: Request) {
  try {
    console.log('server logout');
    const session = await getSession(request);
    return redirect('/', {
      headers: {
        'Set-Cookie': await sessionStorage.destroySession(session),
      },
    });
  } catch (e) {
    console.log('server logout error', e);
  }
}
