import { Button, Table } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import { TransactionReadModel, TransactionsProps } from './types/Transaction';
import { Link } from 'react-router-dom';

const TransactionList = (props: TransactionsProps) => {
  const transactions = props.transactions;
  console.log('[TRANSACTIONS] Received transactions: ', transactions);

  return (
    <div>
      <h2>Transaction List</h2>
      <Table selectable color='teal' key='teal'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Symbol</Table.HeaderCell>
            <Table.HeaderCell>Shares</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Commission</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactions.map((t: TransactionReadModel) => {
            let color = t.type === 'Buy' ? 'blue' : 'red';

            // Read the transactionDate as it (without timezone offsets)
            let utcTransactionDate = new Date(t.transactionDate);
            var timezoneOffset = new Date().getTimezoneOffset() * 60000;
            let transactionDate = new Date(utcTransactionDate.getTime() - -timezoneOffset);

            return (
              <Table.Row key={t.sk}>
                <Table.Cell className={`ui ${color} label`} style={{ margin: '8px' }}>
                  {t.type}
                </Table.Cell>
                <Table.Cell>{transactionDate.toLocaleDateString()}</Table.Cell>
                <Table.Cell>{t.symbol}</Table.Cell>
                <Table.Cell>{t.shares}</Table.Cell>
                <Table.Cell>
                  <NumberFormat
                    value={t.price}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Table.Cell>
                <Table.Cell>
                  <NumberFormat
                    value={t.commission}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    decimalScale={2}
                    fixedDecimalScale={true}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    floated='right'
                    icon='file alternate outline'
                    as={Link}
                    to={{
                      pathname: `/transactions/view/${t.sk}`,
                      state: {
                        transaction: t,
                      },
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {/* <Button.Group>
        <Button labelPosition='left' icon='left chevron' content='Previous' onClick={this.handlePrevPageClick} />
        <Button labelPosition='right' icon='right chevron' content='Next' onClick={this.handleNextPageClick} />
      </Button.Group> */}
    </div>
  );
};

export default TransactionList;
