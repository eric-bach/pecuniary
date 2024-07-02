// import { type NextRequest, NextResponse } from 'next/server';
// import { authenticatedUser } from './utils/amplifyServerUtils';

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next();
//   const user = await authenticatedUser({ request, response });

//   const protectedRoutes = ['/dashboard', '/dashboard/admin', '/accounts'];

//   if (!user && protectedRoutes.includes(request.nextUrl.pathname)) {
//     return NextResponse.redirect(new URL('/auth/login', request.nextUrl.origin));
//   }

//   // const isOnHome = request.nextUrl.pathname === '/' && !request.nextUrl.pathname.startsWith('/auth');
//   // const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
//   // const isOnAdminArea = request.nextUrl.pathname.startsWith('/dashboard/admin');

//   // if (isOnDashboard) {
//   //   if (!user) return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
//   //   if (isOnAdminArea && !user.isAdmin) return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
//   //   return response;
//   // } else if (user) {
//   //   return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
//   // }
// }

import { fetchAuthSession } from 'aws-amplify/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/utils/amplifyServerUtils';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch (error) {
        console.log('user not authenticated');
        return false;
      }
    },
  });

  if (authenticated) {
    return response;
  }

  return NextResponse.redirect(new URL('/auth', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/dashboard',
    '/accounts',
  ],
};
