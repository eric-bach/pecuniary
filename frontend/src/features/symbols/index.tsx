'use client';

import { useNewSymbol } from '@/hooks/use-new-symbol';
import { DataTable } from '@/components/data-table';
import { Symbol } from '../../../../backend/src/appsync/api/codegen/appsync';
import { columns } from '@/app/(main)/symbols/columns';

interface SymbolsProps {
  symbols: Symbol[];
}

export default function Symbols({ symbols }: SymbolsProps) {
  const newSymbol = useNewSymbol();

  return <DataTable filterKey='name' title='Symbols' columns={columns} data={symbols} onClick={() => newSymbol.onOpen()} />;
}
