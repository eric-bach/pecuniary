import { Table } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

import { GET_POSITIONS } from './graphql/graphql';
import { PositionReadModel, PositionsProps } from './types/Position';
import { useQuery } from '@apollo/client';
import Loading from '../../components/Loading';

const Positions = (props: PositionsProps) => {
  const { aggregateId } = props;

  const {
    data: positions,
    error: posError,
    loading: posLoading,
  } = useQuery(GET_POSITIONS, {
    variables: { userId: localStorage.getItem('userId'), aggregateId: aggregateId },
    fetchPolicy: 'cache-and-network', // Check cache but also backend if there are new updates
  });

  // TODO Improve this Error page
  if (posError)
    return (
      <>
        <div>${posError}</div>
      </>
    ); // You probably want to do more here!
  if (posLoading) return <Loading />;

  console.log('[POSITIONS] Positions: ', positions);

  let netWorth = 0;
  positions.getPositions.map((p: any) => {
    netWorth += p.marketValue;
    return netWorth;
  });
  console.log('[POSITIONS] NetWorth: ', netWorth);

  return (
    <div>
      <h2>Positions ({positions.getPositions.length})</h2>
      <Table selectable color='teal' key='teal'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Symbol</Table.HeaderCell>
            <Table.HeaderCell>Decription</Table.HeaderCell>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.HeaderCell>Shares</Table.HeaderCell>
            <Table.HeaderCell>ACB</Table.HeaderCell>
            <Table.HeaderCell>Book Value</Table.HeaderCell>
            <Table.HeaderCell>Market Value</Table.HeaderCell>
            <Table.HeaderCell>Profit/Loss</Table.HeaderCell>
            <Table.HeaderCell>P/L %</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {positions.getPositions.map((p: PositionReadModel) => {
            const pl = p.marketValue - p.bookValue;
            const plPer = ((p.marketValue - p.bookValue) * 100) / p.bookValue;
            return (
              <Table.Row key={p.sk}>
                <Table.Cell>{p.symbol}</Table.Cell>
                <Table.Cell>{p.description}</Table.Cell>
                <Table.Cell>{p.currency}</Table.Cell>
                <Table.Cell>{p.shares}</Table.Cell>
                <Table.Cell>
                  <NumberFormat
                    value={p.acb}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Table.Cell>
                <Table.Cell>
                  <NumberFormat
                    value={p.bookValue}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Table.Cell>
                <Table.Cell>
                  <NumberFormat
                    value={p.marketValue}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Table.Cell>
                <Table.Cell>
                  <NumberFormat
                    value={pl}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Table.Cell>
                <Table.Cell>
                  {' '}
                  <NumberFormat
                    value={plPer}
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix={'%'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Positions;
