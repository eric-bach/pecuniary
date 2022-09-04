import React from 'react';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';

const generateClassName = createGenerateClassName({
  productionPrefix: 'au',
});

export default () => (
  <StylesProvider generateClassName={generateClassName}>
    <div>
      <div>Name: auth</div>
      <div>Framework: react</div>
      <div>Language: TypeScript</div>
      <div>CSS: Empty CSS</div>
    </div>
  </StylesProvider>
);
