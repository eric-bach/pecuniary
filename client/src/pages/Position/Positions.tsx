import { Table } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { PositionReadModel, PositionsProps } from './types/Position';

const Positions = (props: PositionsProps) => {
  const { positions } = props;

  console.log('[POSITIONS] Received positions: ', positions);

  return (
    <div>
      <h2>Positions</h2>
      <Table selectable color='teal' key='teal'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Symbol</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Shares</Table.HeaderCell>
            <Table.HeaderCell>ACB</Table.HeaderCell>
            <Table.HeaderCell>Book Value</Table.HeaderCell>
            <Table.HeaderCell>Market Value</Table.HeaderCell>
            <Table.HeaderCell>Profit/Loss</Table.HeaderCell>
            <Table.HeaderCell>P/L %</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {positions.map((p: PositionReadModel) => {
            const pl = p.marketValue - p.bookValue;
            const plPer = ((p.marketValue - p.bookValue) * 100) / p.bookValue;
            return (
              <Table.Row key={p.id}>
                <Table.Cell>{p.symbol}</Table.Cell>
                <Table.Cell>{p.name}</Table.Cell>
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
