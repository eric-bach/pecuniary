'use server';

import { Category } from '../../../backend/src/appsync/api/codegen/appsync';
import { serverClient } from '@/utils/amplifyServerUtils';
import { getCategories } from '../../../backend/src/appsync/api/queries';
import { SelectOption } from '@/types/select-option';

export async function fetchCategoryOptions(): Promise<SelectOption[]> {
  const { data } = await serverClient.graphql({
    query: getCategories,
  });

  const categories = data.getCategories.items as [Category];

  const categoryOptions = categories.map((str) => {
    return {
      label: str.name,
      value: str.name,
    };
  });

  return categoryOptions;
}
