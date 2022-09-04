import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';

import Header from './components/Header';
import 'finance/FinanceIndex';
import 'marketing/MarketingIndex';

const generateClassName = createGenerateClassName({
  productionPrefix: 'co',
});

const App = () => (
  <Router>
    <StylesProvider generateClassName={generateClassName}>
      <Header />
      <Routes>
        <Route path='/' element={<div id='marketing-dev'></div>} />
        <Route path='/home' element={<div id='finance-dev'></div>} />
      </Routes>
    </StylesProvider>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
