import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from 'convex/react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { CashAccountDetail } from '@/components/accounts/cash-account-detail';
import { InvestmentAccountDetail } from '@/components/accounts/investment-account-detail';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export const Route = createFileRoute('/_auth/accounts/$accountId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { accountId } = Route.useParams();
  const { user } = useAuthenticator((context) => [context.user]);
  const account = useQuery(api.accounts.get, { accountId: accountId as Id<'accounts'> });

  if (!account) {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <div className='text-gray-400'>Loading account...</div>
      </div>
    );
  }

  const userId = user?.username ?? '';

  if (account.type === 'Investment') {
    return <InvestmentAccountDetail accountId={accountId} account={account} userId={userId} />;
  }

  return <CashAccountDetail accountId={accountId} account={account} userId={userId} />;
}
