import { fetchPayeeOptions } from '@/actions';

const Payee = async () => {
  const payees = await fetchPayeeOptions();

  return (
    <div>
      {payees.map((p) => {
        return <div key={p.label}>{p.value}</div>;
      })}
    </div>
  );
};

export default Payee;
