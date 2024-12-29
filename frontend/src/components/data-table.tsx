'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { deleteExistingAccount, deleteExistingBankTransaction, deleteExistingInvestmentTransaction } from '@/actions';
import { Account, BankTransaction, InvestmentTransaction } from '@/../../backend/src/appsync/api/codegen/appsync';
import DeleteItem from './delete-item';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DataTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onClick: () => void;
  filterKey: string;
  disabled?: boolean;
}

export function DataTable<TData, TValue>({ title, columns, data, onClick, filterKey, disabled }: DataTableProps<TData, TValue>) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    table.getFilteredSelectedRowModel().rows.forEach(async (row: any) => {
      if (row.original.entity === 'account') {
        await deleteExistingAccount((row.original as Account).accountId);
      } else if (row.original.entity === 'bank-transaction') {
        await deleteExistingBankTransaction(row.original as BankTransaction);
      } else if (row.original.entity === 'investment-transaction') {
        await deleteExistingInvestmentTransaction(row.original as InvestmentTransaction);
      }
    });

    handleClose();

    table.resetRowSelection();

    toast.success('Success!', {
      description:
        table.getFilteredSelectedRowModel().rows.length > 1
          ? `${table.getFilteredSelectedRowModel().rows.length} items successfully deleted`
          : 'Item successfully deleted',
    });
  };

  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
        <CardTitle className='text-xl-line-clamp-1'>{title}</CardTitle>

        <Button size='sm' onClick={() => onClick()}>
          <Plus className='size-4 mr-2' />
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        <DeleteItem
          isOpen={isOpen}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          dialogTitle={`Are you sure you want to delete ${table.getFilteredSelectedRowModel().rows.length} items?`}
        />

        <div className='flex items-center py-4'>
          <Input
            placeholder={`Filter ${filterKey}...`}
            value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(filterKey)?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />

          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button disabled={disabled} size='sm' variant='outline' className='ml-auto text-xs font-normal' onClick={() => setOpen(true)}>
              <Trash className='mr-2 size-4' />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='flex-1 text-sm text-muted-foreground'>
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

          <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
