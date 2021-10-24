import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';

import client from './client';

import App from './App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
