import Feature from '@/components/home/feature';
import Footer from '@/components/home/footer';
import Header from '@/components/home/header';
import Hero from '@/components/home/hero';
import Testimonial from '@/components/home/testimonial';

const Home = () => {
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
