import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';

import client from './client';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
