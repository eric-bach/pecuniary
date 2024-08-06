'use client';

import { useNewCategory } from '@/hooks/use-new-category';
import { DataTable } from '@/components/data-table';
import { Category } from '../../../../backend/src/appsync/api/codegen/appsync';
import { columns } from '@/app/(main)/categories/columns';
import { useQuery } from '@tanstack/react-query';

export default function Categories() {
  const newCategory = useNewCategory();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => fetch('/api/categories').then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  if (categoriesQuery.isPending) return <div>Loading...</div>;

  const categories: Category[] = categoriesQuery.data;

  return <DataTable filterKey='name' title='Categories' columns={columns} data={categories} onClick={() => newCategory.onOpen()} />;
}
