import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

//const HomePage = ({ history }) => {
const HomePage = () => {
  return (
    <>
      <link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet' />
      <link rel='stylesheet' href='./css/bootstrap.min.css' />
      <link rel='stylesheet' href='./css/font-awesome.min.css' />
      <link rel='stylesheet' href='./css/themify-icons.css' />
      <link rel='stylesheet' href='./css/animate.css' />
      <link rel='stylesheet' href='./css/owl.carousel.css' />
      <link rel='stylesheet' href='./css/style.css' />

      <header className='header-section clearfix'>
        <div className='container-fluid'>
          <a href='/' className='site-logo'>
            <img src='img/logo.png' alt='' />
          </a>
          <div className='responsive-bar'>
            <i className='fa fa-bars'></i>
          </div>
          {/* <Button onClick={() => history.push('/home')} inverted className='site-btn'> */}
          <Link to='/home'>
            <Button inverted className='site-btn'>
              Get started
              <Icon />
            </Button>
          </Link>

          <nav className='main-menu'>
            <ul className='menu-list'>
              <li>
                <a href='#description'>Description</a>
              </li>
              <li>
                <a href='#features'>Features</a>
              </li>
              <li>
                <a href='#getting-started'>Getting Started</a>
              </li>
              <li>
                <a href='#about'>About</a>
              </li>
              <li>
                <a href='#contact'>Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className='hero-section'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6 hero-text'>
              <h2>
                <span>Pecuniary</span>
              </h2>
              <h3>Porfolio Management</h3>
              <br />
              <h4>Modern financial tools to help you grow and manage your money</h4>
              <br />
              {/* <button onClick={() => history.push('/home')} className='site-btn sb-gradients'> */}
              <Link to='/home'>
                <button className='site-btn sb-gradients'>Get Started</button>
              </Link>
            </div>
            <div className='col-md-6'>
              <img src='img/laptop.png' className='laptop-image' alt='' />
            </div>
          </div>
        </div>
      </div>

      <section className='about-section spad'>
        <div id='dessription' className='container'>
          <div className='row'>
            <div className='col-lg-6 offset-lg-6 about-text'>
              <h2>What is Pecuniary?</h2>
              <h5>Pecuniary is an innovative porfolio management service to help you manage all your investments.</h5>
              <p>People love us for our technology. And the nice people who are always around to answer questions.</p>
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
          <div className='about-img'>
            <img src='img/about-img.png' alt='' />
          </div>
        </div>
      </section>

      <section className='features-section spad gradient-bg'>
        <div id='features' className='container text-white'>
          <div className='section-title text-center'>
            <h2>Our Features</h2>
            <p>Pecuniary is the simplest way to manage your money at very low cost.</p>
          </div>
          <div className='row'>
            <div className='col-md-6 col-lg-4 feature'>
              <i className='ti-mobile'></i>
              <div className='feature-content'>
                <h4>Technology</h4>
                <p>
                  Built on the latest technology stack. You can be assured you will always receive the latest updates.
                </p>
              </div>
            </div>
            <div className='col-md-6 col-lg-4 feature'>
              <i className='ti-shield'></i>
              <div className='feature-content'>
                <h4>Safe & Secure</h4>
                <p>
                  Your security and trust are important to us. We're committed to protecting your account with the
                  highest security standards.
                </p>
              </div>
            </div>
            <div className='col-md-6 col-lg-4 feature'>
              <i className='ti-wallet'></i>
              <div className='feature-content'>
                <h4>Account</h4>
                <p>It's quick an easy to setup a new account with Pecuniary and have it manage your investments.</p>
              </div>
            </div>
            <div className='col-md-6 col-lg-4 feature'>
              <i className='ti-headphone-alt'></i>
              <div className='feature-content'>
                <h4>Expert Support</h4>
                <p>We have friendly and knowledgeable people to help you with any questions you may have.</p>
              </div>
            </div>
            <div className='col-md-6 col-lg-4 feature'>
              <i className='ti-reload'></i>
              <div className='feature-content'>
                <h4>Grow your money</h4>
                <p>Get started, whether you're investing, doing taxes, or anything in between.</p>
              </div>
            </div>
            <div className='col-md-6 col-lg-4 feature'>
              <i className='ti-panel'></i>
              <div className='feature-content'>
                <h4>Detailed Analytics</h4>
                <p>
                  Pecuniary is more than a tech platform. It provides you with detailed analytics of your portolio
                  performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='process-section spad'>
        <div id='getting-started' className='container'>
          <div className='section-title text-center'>
            <h2>Get Started With Pecuniary</h2>
            <p>
              Start learning about Pecuniary with interactive tutorials. It’s fun, easy, and takes only a few minutes!
            </p>
          </div>
          <div className='row'>
            <div className='col-md-4 process'>
              <div className='process-step'>
                <figure className='process-icon'>
                  <img src='img/process-icons/1.png' alt='#' />
                </figure>
                <h4>Create Your Account</h4>
                <p>Sign up for you Pecuniary account today.</p>
              </div>
            </div>
            <div className='col-md-4 process'>
              <div className='process-step'>
                <figure className='process-icon'>
                  <img src='img/process-icons/2.png' alt='#' />
                </figure>
                <h4>Link Your Investments</h4>
                <p>Setup your investment accounts to manage with Pecuniary.</p>
              </div>
            </div>
            <div className='col-md-4 process'>
              <div className='process-step'>
                <figure className='process-icon'>
                  <img src='img/process-icons/3.png' alt='#' />
                </figure>
                <h4>Track Your Progress</h4>
                <p>Watch Pecuniary manage your portfolio and investment returns.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='fact-section gradient-bg'>
        <div id='about' className='container'>
          <div className='row'>
            <div className='col-sm-6 col-md-6 col-lg-3'>
              <div className='fact'>
                <h2>5</h2>
                <p>
                  Star <br /> Rating
                </p>
                <i className='ti-star'></i>
              </div>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-3'>
              <div className='fact'>
                <h2>12K</h2>
                <p>
                  Transactions <br /> per hour
                </p>
                <i className='ti-panel'></i>
              </div>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-3'>
              <div className='fact'>
                <h2>5B</h2>
                <p>
                  Largest <br /> Transactions
                </p>
                <i className='ti-stats-up'></i>
              </div>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-3'>
              <div className='fact'>
                <h2>80</h2>
                <p>
                  Years <br /> of Experience
                </p>
                <i className='ti-user'></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className='footer-section'>
        <div id='contact' className='container'>
          <div className='row spad'>
            <div className='col-md-6 col-lg-3 footer-widget'>
              <img src='img/logo.png' className='mb-4' alt='' />
              <p>
                <br />
              </p>
              <span>
                Copyright &copy;
                {new Date().getFullYear()} Eric Bach | All rights reserved | This template is made with{' '}
                <i className='fa fa-heart-o' aria-hidden='true' /> by <a href='https://colorlib.com'>Colorlib</a>
              </span>
            </div>
            <div className='col-md-6 col-lg-2 offset-lg-1 footer-widget'>
              <h5 className='widget-title'>Resources</h5>
              <ul>
                <li>
                  <p>Site Link 1</p>
                </li>
                <li>
                  <p>Site Link 2</p>
                </li>
                <li>
                  <p>Site Link 3</p>
                </li>
                <li>
                  <p>Site Link 4</p>
                </li>
                <li>
                  <p>Site Link 5</p>
                </li>
              </ul>
            </div>
            <div className='col-md-6 col-lg-2 offset-lg-1 footer-widget'>
              <h5 className='widget-title'>Quick Links</h5>
              <ul>
                <li>
                  <p>Site Link 6</p>
                </li>
                <li>
                  <p>Site Link 7</p>
                </li>
                <li>
                  <p>Site Link 8</p>
                </li>
                <li>
                  <p>Site Link 9</p>
                </li>
                <li>
                  <p>Site Link 10</p>
                </li>
              </ul>
            </div>
            <div className='col-md-6 col-lg-3 footer-widget pl-lg-5 pl-3'>
              <h5 className='widget-title'>Follow Us</h5>
              <div className='social'>
                <a href='https://www.ericbach.dev' className='instagram'>
                  <i className='fa fa-user'></i>
                </a>
                <a href='https://www.github.com/eric-bach/pecuniary' className='facebook'>
                  <i className='fa fa-github'></i>
                </a>
                <a href='https://www.linkedin.com/ebach' className='twitter'>
                  <i className='fa fa-linkedin'></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <script src='js/jquery-3.2.1.min.js'></script>
      <script src='js/owl.carousel.min.js'></script>
      <script src='js/main.js'></script>
    </>
  );
};

export default HomePage;
