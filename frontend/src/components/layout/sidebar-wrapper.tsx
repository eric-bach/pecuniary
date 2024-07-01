'use server';

import Sidebar from '@/components/layout/sidebar';
import { fetchAccounts } from '@/actions';

export default async function SidebarWrapper() {
  const accounts = await fetchAccounts();
  // console.log(accounts);

  return <Sidebar accounts={accounts} />;
}
