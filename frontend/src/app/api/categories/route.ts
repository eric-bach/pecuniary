import { serverClient } from '@/utils/amplifyServerUtils';
import { getCategories } from '@/actions/api/queries';
import { Category } from '@/../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const result = (await serverClient.graphql({
    query: getCategories,
  })) as { data: { getCategories: { items: [Category] } } };

  const { data } = result;

  return Response.json(data.getCategories.items as [Category]);
}
