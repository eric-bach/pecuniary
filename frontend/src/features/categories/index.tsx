'use client';

import { useNewCategory } from '@/hooks/use-new-category';
import { DataTable } from '@/components/data-table';
import { Category } from '../../../../backend/src/appsync/api/codegen/appsync';
import { columns } from '@/app/(main)/categories/columns';

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  const newCategory = useNewCategory();

  return <DataTable filterKey='name' title='Categories' columns={columns} data={categories} onClick={() => newCategory.onOpen()} />;
}
