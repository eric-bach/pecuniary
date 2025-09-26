import { serverClient } from '@/utils/amplifyServerUtils';
import { getAccounts } from '@/actions/api/queries';
import { Account } from '@/types/account';

export async function GET(request: Request) {
  try {
    const result = (await serverClient.graphql({
      query: getAccounts,
    })) as { data: { getAccounts: { items: Account[] } } };

    const { data } = result;

    return Response.json(data.getAccounts.items);
  } catch (error) {
    console.error('Error fetching accounts:', error);

    return Response.json([] as Account[]);
  }
}
