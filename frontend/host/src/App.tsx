import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'marketing/MarketingIndex';

import './index.css';

const App = () => (
  <div className='container'>
    <div>Name: host</div>
    <div>Framework: react</div>
    <div>Language: TypeScript</div>
    <div>CSS: Empty CSS</div>
    <Router>
      <Routes>
        <Route path='/' element={<div id='marketing-dev'></div>} />
      </Routes>
    </Router>
  </div>
);
ReactDOM.render(<App />, document.getElementById('root'));
