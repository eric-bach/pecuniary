import type { NextPage } from 'next';
import Header from '@/components/home/header';
import Hero from '@/components/home/hero';
import Footer from '@/components/home/footer';
import Feature from '@/components/home/feature';
import Testimonial from '@/components/home/testimonial';

const Home: NextPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main className='flex-grow'>
        <Hero />
        <Feature />
        <Testimonial />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
