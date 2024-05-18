import Head from 'next/head';
import './globals.css';
import { Footer } from '@/components/sidebar/sidebar.styles';
import Navbar from './navbar';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Blinder</title>
        <meta
          name='description'
          content='Blinder making it simple for you to build and grow your SaaS applications, or any business idea'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
