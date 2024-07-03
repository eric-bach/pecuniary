import Feature from '@/components/layout-home/feature';
import Footer from '@/components/layout-home/footer';
import Header from '@/components/layout-home/header';
import Hero from '@/components/layout-home/hero';
import Testimonial from '@/components/layout-home/testimonial';

const Home = () => {
  return (
    <div className='flex h-screen flex-col'>
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
