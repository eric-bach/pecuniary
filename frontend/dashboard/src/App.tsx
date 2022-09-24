import React, { useState, useEffect } from 'react';
import { StylesProvider, createGenerateClassName } from '@material-ui/core';
import { gql } from '@apollo/client';

export const GET_ACCOUNTS = gql`
  query GetAccounts($userId: String!, $lastEvaluatedKey: LastEvaluatedKey) {
    getAccounts(userId: $userId, lastEvaluatedKey: $lastEvaluatedKey) {
      items {
        userId
        sk
        aggregateId
        type
        name
        description
        currencies {
          currency
          bookValue
          marketValue
        }
      }
      lastEvaluatedKey {
        userId
        sk
      }
    }
  }
`;

const generateClassName = createGenerateClassName({
  productionPrefix: 'fi',
});

export default ({ client }: any) => {
  const [lastEvaluatedKey, setLastEvaluatedKey]: [any, any] = useState();
  const [accounts, setAccounts]: [any, any] = useState([]);
  const [loading, setLoading]: [boolean, any] = useState(true);
  const [hasMoreData, setHasMoreData] = useState(false);

  const getAccounts = async () => {
    const response = await client.query({
      query: GET_ACCOUNTS,
      variables: {
        userId: localStorage.getItem('userId'),
        lastEvaluatedKey: lastEvaluatedKey
          ? {
              userId: lastEvaluatedKey.userId,
              sk: lastEvaluatedKey.sk,
            }
          : lastEvaluatedKey,
      },
    });

    if (response && response.data) {
      console.log('[ACCOUNT LIST] Get Accounts:', response.data.getAccounts.items);
      setLastEvaluatedKey(response.data.getAccounts.lastEvaluatedKey);
      console.log('[ACCOUNT LIST] Last Evaluated Key:', response.data.getAccounts.lastEvaluatedKey);

      setAccounts([...accounts, ...response.data.getAccounts.items]);
      if (response.data.getAccounts.lastEvaluatedKey) {
        setHasMoreData(true);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    //accounts.length === 0) {
    return 'Loading...';
  }

  return (
    <StylesProvider generateClassName={generateClassName}>
      <div>
        <div>Name: finance</div>
        <div>Framework: react</div>
        <div>Language: TypeScript</div>
        <div>CSS: Empty CSS</div>
      </div>
    </StylesProvider>
  );
};
