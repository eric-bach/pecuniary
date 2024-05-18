import Head from 'next/head';
import Image from 'next/image';
import GradientWrapper from './GradientWrapper';
import NavLink from './navlink';
import SectionWrapper from './SectionWrapper';
import Navbar from './navbar';
import aws from '../../../public/logos/aws.svg';
import freshbooks from '../../../public/logos/freshbooks.svg';
import sendgrid from '../../../public/logos/sendgrid.svg';
import layers from '../../../public/logos/layers.svg';
import adobe from '../../../public/logos/adobe.svg';
import ctaImage from '../../../public/cta-image.jpg';
import nextjs from '../../../public/icons/nextjs.svg';
import tailwind from '../../../public/icons/tailwind.svg';
import nodejs from '../../../public/icons/nodejs.svg';
import vercel from '../../../public/icons/vercel.svg';
import figma from '../../../public/icons/figma.svg';

import './styles.css';

const logos = [
  {
    src: aws,
    alt: 'aws',
  },
  {
    src: sendgrid,
    alt: 'sendgrid',
  },
  {
    src: layers,
    alt: 'layers',
  },
  {
    src: adobe,
    alt: 'adobe',
  },
];

const toolkit = [
  {
    icon: aws,
    title: 'aws',
    desc: 'AWS provides an on-demand cloud computing platform.',
  },
  {
    icon: nextjs,
    title: 'Next.js',
    desc: 'Next.js is a React framework that gives you building blocks to create web apps.',
  },
  {
    icon: tailwind,
    title: 'Tailwind CSS',
    desc: 'Tailwind CSS is basically a utility-first CSS framework for rapidly building UIs.',
  },
  {
    icon: nodejs,
    title: 'Node.js',
    desc: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment.',
  },
  {
    icon: vercel,
    title: 'Vercel',
    desc: 'Vercel is a cloud platform that enables developers to host web apps.',
  },
  {
    icon: figma,
    title: 'Figma',
    desc: 'Figma is a web-based graphics editing and user interface design app.',
  },
];

const socialInfo = [
  {
    icon: (
      <svg className='w-6 h-6 hover:text-gray-500 duration-150' fill='none' viewBox='0 0 48 48'>
        <g clipPath='url(#a)'>
          <path
            fill='currentColor'
            d='M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24z'
          />
        </g>
        <defs>
          <clipPath id='a'>
            <path fill='#fff' d='M0 0h48v48H0z' />
          </clipPath>
        </defs>
      </svg>
    ),
    href: '#',
  },
  {
    icon: (
      <svg className='w-6 h-6 hover:text-gray-500 duration-150' fill='none' viewBox='0 0 48 48'>
        <g clipPath='url(#clip0_17_80)'>
          <path
            fill='currentColor'
            d='M15.1 43.5c18.11 0 28.017-15.006 28.017-28.016 0-.422-.01-.853-.029-1.275A19.998 19.998 0 0048 9.11c-1.795.798-3.7 1.32-5.652 1.546a9.9 9.9 0 004.33-5.445 19.794 19.794 0 01-6.251 2.39 9.86 9.86 0 00-16.788 8.979A27.97 27.97 0 013.346 6.299 9.859 9.859 0 006.393 19.44a9.86 9.86 0 01-4.462-1.228v.122a9.844 9.844 0 007.901 9.656 9.788 9.788 0 01-4.442.169 9.867 9.867 0 009.195 6.843A19.75 19.75 0 010 39.078 27.937 27.937 0 0015.1 43.5z'
          />
        </g>
        <defs>
          <clipPath id='clip0_17_80'>
            <path fill='#fff' d='M0 0h48v48H0z' />
          </clipPath>
        </defs>
      </svg>
    ),
    href: '#',
  },
  {
    icon: (
      <svg className='w-6 h-6 hover:text-gray-500 duration-150' fill='none' viewBox='0 0 28 28'>
        <g clipPath='url(#clip0_1213_3074)'>
          <path
            fill='currentColor'
            d='M25.927 0H2.067C.924 0 0 .902 0 2.018v23.959C0 27.092.924 28 2.067 28h23.86C27.07 28 28 27.092 28 25.982V2.018C28 .902 27.07 0 25.927 0zM8.307 23.86H4.151V10.495h4.156V23.86zM6.229 8.673a2.407 2.407 0 110-4.812 2.406 2.406 0 010 4.812zM23.86 23.86h-4.15v-6.497c0-1.547-.028-3.543-2.16-3.543-2.16 0-2.49 1.69-2.49 3.434v6.606h-4.144V10.495h3.98v1.826h.056c.552-1.05 1.908-2.16 3.926-2.16 4.206 0 4.982 2.767 4.982 6.366v7.333z'
          />
        </g>
        <defs>
          <clipPath id='clip0_1213_3074'>
            <path fill='#fff' d='M0 0h28v28H0z' />
          </clipPath>
        </defs>
      </svg>
    ),
    href: '#',
  },
];

// https://floatui.com/templates/blinder
export default function HomePage() {
  return (
    <>
      <Head>
        <meta name='robots' content='index' />
      </Head>

      <Navbar />

      {/* Hero */}
      <section>
        <div className='custom-screen py-28 text-gray-600'>
          <div className='space-y-5 max-w-4xl mx-auto text-center'>
            <h1 className='text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl'>Track your money and investments in one place</h1>
            <p className='max-w-xl mx-auto'>
              Pecuniary makes it simple for you to track your accounts, investments, and spending all in one place. Get started today and
              take control of your finances.
            </p>
            <div className='flex items-center justify-center gap-x-3 font-medium text-sm'>
              <NavLink href='/auth/signup' className='text-gray-700 border hover:bg-gray-50' scroll={false}>
                Sign up
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* LogoGrid */}
      <div>
        <div className='custom-screen'>
          <h2 className='font-semibold text-sm text-gray-600 text-center'>BUILT WITH MODERN TECHNOLOGIES</h2>
          <div className='mt-6'>
            <ul className='flex gap-x-10 gap-y-6 flex-wrap items-center justify-center md:gap-x-16'>
              {logos.map((item, idx) => (
                <li key={idx}>
                  <Image src={item.src} alt={item.alt} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <GradientWrapper>
        <SectionWrapper id='cta' className='pb-0'>
          <div className='custom-screen'>
            <div className='items-center gap-x-12 lg:flex'>
              <div className='flex-1 sm:hidden lg:block'>
                <Image src={ctaImage} className='rounded-lg md:max-w-lg' alt='Create Successful Business Models with Our IT Solutions' />
              </div>
              <div className='max-w-xl mt-6 md:mt-0 lg:max-w-2xl'>
                <h2 className='text-gray-800 text-3xl font-semibold sm:text-4xl'>
                  Create Successful Business Models with Our IT Solutions
                </h2>
                <p className='mt-3 text-gray-600'>
                  Pecuniary, a software development company, helps to digitize businesses by focusing on client’s business challenges,
                  needs. We value close transparent cooperation and encourage our clients to participate actively in the project development
                  life cycle.
                </p>
                <NavLink
                  href='/signup'
                  className='inline-block mt-4 font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                >
                  Get started
                </NavLink>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </GradientWrapper>

      {/* Toolkit */}
      <SectionWrapper>
        <div id='toolkit' className='max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8'>
          <div className='max-w-2xl mx-auto space-y-3 sm:text-center'>
            <h2 className='text-gray-800 text-3xl font-semibold sm:text-4xl'>Work with the best toolkit</h2>
            <p>These are a few of our favourite things</p>
          </div>
          <div className='mt-12'>
            <ul className='grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-3'>
              {toolkit.map((item, idx) => (
                <li key={idx} className='flex gap-x-4'>
                  <div className='flex-none w-12 h-12 gradient-border rounded-full flex items-center justify-center'>
                    <Image src={item.icon} alt={item.title} />
                  </div>
                  <div>
                    <h4 className='text-lg text-gray-800 font-semibold'>{item.title}</h4>
                    <p className='mt-3'>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      <footer>
        <div className='custom-screen pt-16'>
          <div className='mt-10 py-10 border-t items-center justify-between sm:flex'>
            <p className='text-gray-600'>© 2024 Pecuniary. All rights reserved.</p>
            <div className='flex items-center gap-x-6 text-gray-400 mt-6'>
              {socialInfo.map((item, idx) => (
                <a key={idx} href={item.href} aria-label='social media' target='_blank' rel='noreferrer'>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
