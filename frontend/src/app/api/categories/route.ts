import { serverClient } from '@/utils/amplifyServerUtils';
import { getCategories } from '../../../../../backend/src/appsync/api/queries';
import { Category } from '../../../../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { data } = await serverClient.graphql({
    query: getCategories,
  });

  return Response.json(data.getCategories.items as [Category]);
}
