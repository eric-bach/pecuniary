import { serverClient } from '@/utils/amplifyServerUtils';
import { getSymbols } from '../../../../../backend/src/appsync/api/queries';
import { Symbol } from '../../../../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { data } = await serverClient.graphql({
    query: getSymbols,
  });

  return Response.json(data.getSymbols.items as [Symbol]);
}
