import { fetchPayees } from '@/actions/fetch-payees';
import Payees from '@/features/payees';

const PayeesPage = async () => {
  const payees = await fetchPayees();

  return (
    <div className='mx-auto w-full max-w-screen-2xl pb-10'>
      <Payees payees={payees} />
    </div>
  );
};

export default PayeesPage;
