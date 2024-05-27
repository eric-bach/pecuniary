import { Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React from 'react';
import { RenderCell } from './render-cell';
import { Account } from '../../../../../infrastructure/graphql/api/codegen/appsync';

export interface TableData {
  columns: {
    name: string;
    uid: string;
  }[];
  accounts: Account[];
}

export const TableWrapper = (data: TableData) => {
  console.log(data);

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
        <TableBody items={data.accounts}>
          {/* {(item) => <TableRow>{(columnKey) => <TableCell>{RenderCell({ account: item, columnKey: columnKey })}</TableCell>}</TableRow>} */}
        </TableBody>
      </Table>
    </div>
  );
};
