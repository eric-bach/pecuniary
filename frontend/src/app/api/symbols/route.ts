import { serverClient } from '@/utils/amplifyServerUtils';
import { getSymbols } from '@/actions/api/queries';
import { Symbol } from '@/../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const result = (await serverClient.graphql({
    query: getSymbols,
  })) as { data: { getSymbols: { items: [Symbol] } } };

  const { data } = result;

  return Response.json(data.getSymbols.items as [Symbol]);
}
