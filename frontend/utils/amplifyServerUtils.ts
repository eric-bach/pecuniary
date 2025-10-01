// https://aws.amazon.com/blogs/mobile/amplify-javascript-v6/

import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { cookies } from 'next/headers';

import { config } from '@/awsconfig';

// This is used to make authenticated AWS calls in middleware
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

// This is used to make authenticated AWS calls in pages
export const serverClient = generateServerClientUsingCookies({
  config,
  cookies,
});
