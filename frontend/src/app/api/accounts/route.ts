import { serverClient } from '@/utils/amplifyServerUtils';
import { getAccounts } from '@/actions/api/queries';
import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const result = (await serverClient.graphql({
    query: getAccounts,
  })) as { data: { getAccounts: { items: [Account] } } };

  const { data } = result;

  return Response.json(data.getAccounts.items as [Account]);
}
