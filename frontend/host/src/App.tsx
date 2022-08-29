import React from 'react';
import ReactDOM from 'react-dom';
import 'marketing/MarketingIndex';

import './index.css';

const App = () => (
  <div className='container'>
    <div>Name: host</div>
    <div>Framework: react</div>
    <div>Language: TypeScript</div>
    <div>CSS: Empty CSS</div>
    <div id='marketing-dev'></div>
  </div>
);
ReactDOM.render(<App />, document.getElementById('root'));
