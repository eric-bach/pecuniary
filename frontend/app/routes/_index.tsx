import type { LoaderFunction, V2_MetaFunction } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import React from 'react';
import { useOptionalUser } from '~/utils/user';

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader: LoaderFunction = async () => {
  return await fetch('https://goweather.herokuapp.com/weather/Edmonton');
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  console.log('[INDEX] User', user);

  if (user) {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
        <h1 className='text-3xl font-bold underline'>Welcome to Edmonton</h1>
        <div>The current temperature is {data.temperature}</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <h1>Some public page</h1>
    </React.Fragment>
  );
}
