'use client';

import { useNewSymbol } from '@/hooks/use-new-symbol';
import { DataTable } from '@/components/data-table';
import { Symbol } from '../../../../backend/src/appsync/api/codegen/appsync';
import { columns } from '@/app/(main)/symbols/columns';
import { useQuery } from '@tanstack/react-query';

export default function Symbols() {
  const newSymbol = useNewSymbol();

  const symbolsQuery = useQuery({
    queryKey: ['sumbols'],
    queryFn: async () => fetch('/api/symbols').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  if (symbolsQuery.isPending) return <div>Loading...</div>;

  const symbols: Symbol[] = symbolsQuery.data;

  return <DataTable filterKey='name' title='Symbols' columns={columns} data={symbols} onClick={() => newSymbol.onOpen()} />;
}
