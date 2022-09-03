import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';

import 'finance/FinanceIndex';
import 'marketing/MarketingIndex';

import './index.css';

const App = () => (
  <div className='container'>
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<div id='marketing-dev'></div>} />
        <Route path='/home' element={<div id='finance-dev'></div>} />
      </Routes>
    </Router>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
