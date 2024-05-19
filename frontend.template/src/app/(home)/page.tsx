import Header from './header';
import Hero from './hero';
import Footer from './footer';
import './styles.css';
import { Feature } from './feature';
import Testimonial from './testimonial';

export default function HomePage() {
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
}
