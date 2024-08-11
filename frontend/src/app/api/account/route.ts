import { serverClient } from '@/utils/amplifyServerUtils';
import { getAccount } from '../../../../../backend/src/appsync/api/queries';
import { Account } from '../../../../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const accountId = searchParams.get('accountId') ?? '';

  const { data } = await serverClient.graphql({
    query: getAccount,
    variables: {
      accountId,
    },
  });

  return Response.json(data.getAccount as Account);
}
