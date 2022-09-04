import React from 'react';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';

const generateClassName = createGenerateClassName({
  productionPrefix: 'fi',
});

export default () => (
  <StylesProvider generateClassName={generateClassName}>
    <div>
      <div>Name: finance</div>
      <div>Framework: react</div>
      <div>Language: TypeScript</div>
      <div>CSS: Empty CSS</div>
    </div>
  </StylesProvider>
);
