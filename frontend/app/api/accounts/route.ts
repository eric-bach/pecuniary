import { NextResponse } from 'next/server';
import { serverClient } from '@/utils/amplifyServerUtils';
import { getAccounts } from '@/actions/api/queries';
import type { GetAccountsResponse as AccountsData } from '@/types/generated';

// Type for the complete GraphQL response with errors
interface GraphQLResponse {
  data: {
    getAccounts: AccountsData;
  };
  errors?: Array<{
    message: string;
    path?: string[];
    errorType?: string;
  }>;
}

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const lastEvaluatedKey = searchParams.get('lastEvaluatedKey');

    const result = (await serverClient.graphql({
      query: getAccounts,
      variables: {
        lastEvaluatedKey,
      },
    })) as GraphQLResponse;

    // Handle GraphQL errors
    if (result.errors && result.errors.length > 0) {
      console.error('GraphQL errors:', result.errors);
      return NextResponse.json({ error: 'GraphQL query failed', details: result.errors }, { status: 400 });
    }

    const { data } = result;

    if (!data?.getAccounts) {
      return NextResponse.json({ error: 'No accounts data returned' }, { status: 404 });
    }

    return NextResponse.json({
      accounts: data.getAccounts.items,
      nextToken: data.getAccounts.nextToken,
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
