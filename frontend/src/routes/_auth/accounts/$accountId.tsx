import { NavbarActions, NavbarTitle } from '@/components/layout/navbar-portal';
import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { Pencil } from 'lucide-react';

export const Route = createFileRoute('/_auth/accounts/$accountId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { accountId } = Route.useParams();
  const account = useQuery(api.accounts.get, { accountId: accountId as Id<'accounts'> });

  return (
    <div className='flex-1'>
      <NavbarTitle>
        <div className='flex items-center gap-1.5 text-lg font-semibold'>
          <Link to='/accounts' className='text-gray-400 hover:text-gray-700 transition-colors'>
            Accounts
          </Link>
          <span className='text-gray-400'>/</span>
          <span>{account?.name ?? '...'}</span>
        </div>
      </NavbarTitle>
      <NavbarActions>
        <Button size='sm' className='bg-[#0067c0] hover:bg-[#005bb5] text-white h-8 text-sm px-3 shadow-none'>
          <Pencil className='h-3.5 w-3.5 mr-1.5' />
          Edit Account
        </Button>
      </NavbarActions>
      <div>Hello "/_auth/accounts/$accountId"!</div>
    </div>
  );
}
