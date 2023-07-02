import { useLoaderData } from '@remix-run/react';
import { Container } from '@mui/material';

export function meta() {
  return {
    title: 'Home Page',
    description: 'This is the Home Page!',
  };
}

export async function loader() {
  return await fetch('https://goweather.herokuapp.com/weather/Edmonton');
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container>
      <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
        <h1>Welcome to Remix</h1>
        <p>The current temperature is {data.temperature}</p>
      </div>
    </Container>
  );
}
