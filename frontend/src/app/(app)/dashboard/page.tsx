import { Content } from '@/components/dashboard/content';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';

async function getAccounts() {
  const accounts = await cookieBasedClient.graphql({
    query: 'query GetAccounts { getAccounts { pk } }',
  });

  return accounts;
}

const dashboard = async () => {
  const accountsData = await getAccounts();
  //@ts-ignore
  const accounts = accountsData.data.getAccounts;

  console.log(accounts);

  return <Content />;
};

export default dashboard;
