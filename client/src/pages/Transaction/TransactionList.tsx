import { Table, Button } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';

const TransactionList = (props: any) => {
  const { transactions } = props;
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
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactions.map((t: any) => {
            let color = t.transactionType.name === 'Buy' ? 'blue' : 'red';

            const price = t.price; // ? t.price.toFixed(2) : 0;
            const commission = t.commission; // ? t.commission.toFixed(2) : 0;

            return (
              <Table.Row key={t.id}>
                <Table.Cell className={`ui ${color} label`} style={{ margin: '8px' }}>
                  {t.transactionType.name}
                </Table.Cell>
                <Table.Cell>{new Date(t.transactionDate).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{t.symbol}</Table.Cell>
                <Table.Cell>{t.shares}</Table.Cell>
                <Table.Cell>
                  <NumberFormat value={price} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </Table.Cell>
                <Table.Cell>
                  <NumberFormat value={commission} displayType={'text'} thousandSeparator={true} prefix={'$'} />
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
