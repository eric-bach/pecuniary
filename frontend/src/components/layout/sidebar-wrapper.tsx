'use server';

import Sidebar from '@/components/layout/sidebar';
import { fetchAccounts } from '@/actions';

export default async function SidebarWrapper() {
  const accounts = await fetchAccounts();

  return <Sidebar accounts={accounts} />;
}
