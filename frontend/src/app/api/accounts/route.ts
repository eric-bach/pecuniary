import { serverClient } from '@/utils/amplifyServerUtils';
import { getAccounts } from '../../../../../backend/src/appsync/api/queries';
import { Account } from '../../../../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { data } = await serverClient.graphql({
    query: getAccounts,
  });

  return Response.json(data.getAccounts.items as [Account]);
}
