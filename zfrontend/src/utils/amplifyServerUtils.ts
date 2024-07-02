import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { cookies } from 'next/headers';
import { config } from '@/awsconfig';
// import { redirect } from 'next/navigation';

//This is used to make authenticated AWS calls in middleware
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

//This is used to make authenticated AWS calls in pages
export const cookieBasedClient = generateServerClientUsingCookies({
  config,
  cookies,
});

// export async function nextRedirect(path: string) {
//   redirect(path);
// }
