'use server';
import { NextServer } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext } from './amplifyServerUtils';
import { redirect } from 'next/navigation';

// export async function authenticatedUser(context: NextServer.Context) {
//   return await runWithAmplifyServerContext({
//     nextServerContext: context,
//     operation: async (contextSpec) => {
//       try {
//         const session = await fetchAuthSession(contextSpec);

//         if (!session.tokens) {
//           return;
//         }

//         const user = {
//           ...(await getCurrentUser(contextSpec)),
//           isAdmin: false,
//         };

//         const groups = session.tokens.accessToken.payload['cognito:groups'];

//         // @ts-ignore
//         user.isAdmin = Boolean(groups && groups.includes('Admins'));

//         return user;
//       } catch (error) {
//         console.log(error);
//       }
//     },
//   });
// }

export async function nextRedirect(path: string) {
  redirect(path);
}
