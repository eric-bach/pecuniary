import { cookieBasedClient } from '@/utils/amplifyServerUtils';

async function fetchAccounts() {
  const accounts = await cookieBasedClient.graphql({
    // query: getAccounts,
    query: 'query GetAccounts { getAccounts { pk } }',
  });

  return accounts;
}

async function fetchAccount(accountId: string) {
  const account = await cookieBasedClient.graphql({
    query: `query GetAccount { getAccount($accountId: ${accountId} ) { pk } }`,
    // query: getAccount,
    variables: { accountId },
  });

  return account;
}

const Investments = async () => {
  // const accountsData = await fetchAccounts();
  // const accounts = accountsData.data.getAccounts;
  // console.log(accounts);
  // const accountData = await fetchAccount('b37596df-d746-436e-abc5-f2f3b08ace97');
  // const account = accountData.data.getAccount;
  // console.log(account);

  return (
    <div>
      <h1>Accounts</h1>
      {/* <ul>
        {accounts?.map((account) => (
          <li key={account?.accountId}>
            {account?.accountId} - {account?.name}
          </li>
        ))}
      </ul>
      <h2>Individual Account</h2>
      <p>
        {account?.accountId} - {account?.name}
      </p> */}
    </div>
  );
};

export default Investments;
