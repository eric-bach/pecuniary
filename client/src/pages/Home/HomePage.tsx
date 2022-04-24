import { useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { Statistic, Message, Divider } from 'semantic-ui-react';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';

import { CognitoUserSession } from '../types/CognitoUserSession';
import { GET_ALL_POSITIONS } from './graphql/graphql';
import NumberFormat from 'react-number-format';

const HomePage = () => {
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  const { data, error, loading } = useQuery(GET_ALL_POSITIONS, {
    variables: { userId: userId },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });
  const { getSession } = useContext(UserContext);

  useEffect(() => {
    // Get the logged in user
    getSession().then((session: CognitoUserSession) => {
      setUserId(session.idToken.payload.email);
      console.log('[ACCOUNTS] Get user:', session.idToken.payload.email);
    });

    setLoading(false);
  }, [getSession]);

  if (error) return <div>${JSON.stringify(error)}</div>; // You probably want to do more here!
  if (loading || isLoading) return <Loading />;

  console.log('[HOME PAGE] Positions:', data);
  const positions = data.getAllPositions;
  const bookValue = positions.reduce((n: any, { bookValue }: any) => n + bookValue, 0);
  const netWorth = positions.reduce((n: any, { marketValue }: any) => n + marketValue, 0);
  const profit = netWorth - bookValue;
  const profitPer = ((netWorth - bookValue) / bookValue) * 100;

  return (
    <>
      <Message color='teal' header='Welcome back!' content='Here is your account overview.' />
      <Divider hidden />

      <Statistic.Group widths='three'>
        <Statistic>
          <Statistic.Value>
            <NumberFormat value={netWorth} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
          </Statistic.Value>
          <Statistic.Label>Net Worth</Statistic.Label>
        </Statistic>

        <Statistic color={profit >= 0 ? 'green' : 'red'}>
          <Statistic.Value>
            <NumberFormat value={profit} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />
          </Statistic.Value>
          <Statistic.Label>Return ($)</Statistic.Label>
        </Statistic>

        <Statistic color={profit >= 0 ? 'green' : 'red'}>
          <Statistic.Value>
            <NumberFormat value={profitPer} displayType={'text'} thousandSeparator={true} suffix={'%'} decimalScale={1} />
          </Statistic.Value>
          <Statistic.Label>Return (%)</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    </>
  );
};

export default HomePage;
