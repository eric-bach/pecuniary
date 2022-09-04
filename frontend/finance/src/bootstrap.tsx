import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory, createBrowserHistory } from 'history';

import App from './App';

const mount = (el: any, { onNavigate, defaultHistory, initialPath }: any) => {
  const history = defaultHistory || createMemoryHistory({ initialEntries: [initialPath] });

  // When navigation occurs, use the listen handler to call onNavigate()
  if (onNavigate) {
    history.listen(onNavigate);
  }

  ReactDOM.render(<App history={history} />, el);

  return {
    onParentNavigate({ pathname: nextPathname }: { pathname: string }) {
      const { pathname } = history.location;

      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

// Scenario #1
// We are running this file in development in isolation
// We are using our local index.html file
// Which DEFINITELY has an element with an ide of 'dev-products'
// We want to immediately render our app into that element
if (process.env.NODE_ENV === 'development') {
  const el = document.querySelector('#finance-dev');

  // Assuming our container doesn't have an element with id 'dev-products'
  if (el) {
    // We are probably running in isolation (Scenario #1)
    mount(el, { defaultHistory: createBrowserHistory() });
  }
}

// Scenario #2
// We are running this file in development or production through the CONTAINER app
// NO GUARANTEE that an element with an id of 'dev-products' exists
// WE DO NOT WANT to try to immediately render the app

export { mount };
