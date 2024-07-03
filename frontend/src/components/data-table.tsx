'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Trash } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteExistingAccount } from '@/actions';
import { Account } from '@/../../infrastructure/graphql/api/codegen/appsync';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
}

function isAccount(obj: any): obj is Account {
  return typeof obj === 'object' && obj !== null && typeof obj.accountId === 'string';
}

export function DataTable<TData, TValue>({ columns, data, filterKey, onDelete, disabled }: DataTableProps<TData, TValue>) {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string>('');

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const { toast } = useToast();

  const handleClose = () => {
    setOpen(false);
    setDeleteConfirm('');
  };

  const handleConfirm = async () => {
    table.getFilteredSelectedRowModel().rows.forEach(async (row) => {
      if (isAccount(row.original)) {
        await deleteExistingAccount((row.original as Account).accountId);
      } else {
        // TODO Handle other types here
      }
    });

    handleClose();

    table.resetRowSelection();

    toast({
      title: 'Success!',
      description:
        table.getFilteredSelectedRowModel().rows.length > 1
          ? `${table.getFilteredSelectedRowModel().rows.length} Accounts successfully deleted`
          : 'Account successfully deleted',
    });
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleInputChange = (event: any) => {
    setDeleteConfirm(event.target.value);
  };

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

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete {table.getFilteredSelectedRowModel().rows.length} accounts?</DialogTitle>
            <DialogDescription>To confirm deletion, enter &quot;delete&quot; below</DialogDescription>
          </DialogHeader>
          <Input type='text' value={deleteConfirm} onChange={handleInputChange} placeholder='Enter "delete" to confirm' />
          <DialogFooter className='pt-2'>
            <Button onClick={handleCancel} variant='outline'>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={deleteConfirm !== 'delete'}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </div>
  );
}
