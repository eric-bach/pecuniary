import { serverClient } from '@/utils/amplifyServerUtils';
import { getPayees } from '@/actions/api/queries';
import { Payee } from '@/../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const result = (await serverClient.graphql({
    query: getPayees,
  })) as { data: { getPayees: { items: [Payee] } } };

  const { data } = result;

  return Response.json(data.getPayees.items as [Payee]);
}
