import React from 'react';
import type { V2_MetaFunction } from '@remix-run/node';
import { useAuthenticator } from '@aws-amplify/ui-react';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  const { user } = useAuthenticator((context) => [context.user]);

  if (user) {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
        <h1 className='text-3xl font-bold underline'>You are logged in</h1>
      </div>
    );
  }

  return (
    <React.Fragment>
      <h1>Some public page</h1>
    </React.Fragment>
  );
}
