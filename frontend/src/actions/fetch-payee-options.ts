'use server';

import { Payee } from '../../../backend/src/appsync/api/codegen/appsync';
import { serverClient } from '@/utils/amplifyServerUtils';
import { getPayees } from '../../../backend/src/appsync/api/queries';
import { SelectOption } from '@/types/select-option';

export async function fetchPayeeOptions(): Promise<SelectOption[]> {
  const { data } = await serverClient.graphql({
    query: getPayees,
  });

  const payees = data.getPayees.items as [Payee];

  const payeeOptions = payees.map((str) => {
    return {
      label: str.name,
      value: str.name,
    };
  });

  return payeeOptions;
}
