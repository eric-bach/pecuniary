import { serverClient } from '@/utils/amplifyServerUtils';
import { getAccount } from '@/actions/api/queries';
import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const accountId = searchParams.get('accountId') ?? '';

  const result = (await serverClient.graphql({
    query: getAccount,
    variables: {
      accountId,
    },
  })) as { data: { getAccount: Account } };

  const { data } = result;

  return Response.json(data.getAccount as Account);
}
