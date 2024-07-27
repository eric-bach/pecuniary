'use client';

import { Account } from '@/../../backend/src/appsync/api/codegen/appsync';
import { useNewAccount } from '@/hooks/use-new-account';
import { DataTable } from '@/components/data-table';
import { columns } from '@/app/(main)/accounts/columns';

interface ManageAccountsProps {
  accounts: [Account];
}

const Accounts = ({ accounts }: ManageAccountsProps) => {
  const newAccount = useNewAccount();

  return <DataTable filterKey='name' title='Accounts' columns={columns} data={accounts} onClick={newAccount.onOpen} />;
};

export default Accounts;
