import { serverClient } from '@/utils/amplifyServerUtils';
import { getPayees } from '../../../../../backend/src/appsync/api/queries';
import { Payee } from '../../../../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { data } = await serverClient.graphql({
    query: getPayees,
  });

  return Response.json(data.getPayees.items as [Payee]);
}
