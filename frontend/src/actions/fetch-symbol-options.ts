'use server';

import { Symbol } from '../../../backend/src/appsync/api/codegen/appsync';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { getSymbols } from '../../../backend/src/appsync/api/queries';
import { SelectOption } from '@/types/select-option';

export async function fetchSymbolOptions(): Promise<SelectOption[]> {
  const { data } = await cookieBasedClient.graphql({
    query: getSymbols,
  });

  const symbols = data.getSymbols.items as [Symbol];

  const symbolOptions = symbols.map((str) => {
    return {
      label: str.name,
      value: str.name,
    };
  });

  return symbolOptions;
}
