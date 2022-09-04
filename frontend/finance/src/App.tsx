import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';

const generateClassName = createGenerateClassName({
  productionPrefix: 'fi',
});

export default ({ history }: any) => (
  <StylesProvider generateClassName={generateClassName}>
    <div>
      <div>Name: finance</div>
      <div>Framework: react</div>
      <div>Language: TypeScript</div>
      <div>CSS: Empty CSS</div>
    </div>
    <Router history={history}>
      <Switch></Switch>
    </Router>
  </StylesProvider>
);
