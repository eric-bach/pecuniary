import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React from 'react';
import { RenderCell } from './render-cell';
import { Account } from '../../../../../infrastructure/graphql/api/codegen/appsync';

export interface TableData {
  columns: {
    name: string;
    uid: string;
  }[];
  accounts: [Account];
}

export const TableWrapper = (data: TableData) => {
  return (
    <div className=' w-full flex flex-col gap-4'>
      <Table aria-label='Example table with custom cells'>
        <TableHeader columns={data.columns}>
          {(column) => (
            <TableColumn key={column.uid} hideHeader={column.uid === 'actions'} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {data.accounts.map((account) => (
            <TableRow key={account.accountId}>
              {data.columns.map((column) => (
                <TableCell key={column.uid}>
                  <RenderCell account={account} columnKey={column.uid} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
