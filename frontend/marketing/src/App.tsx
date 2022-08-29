import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

const App = () => (
  <div className='container'>
    <div>Name: marketing</div>
    <div>Framework: react</div>
    <div>Language: TypeScript</div>
    <div>CSS: Empty CSS</div>
  </div>
);
ReactDOM.render(<App />, document.getElementById('marketing-dev'));
