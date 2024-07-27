import { fetchSymbols } from '@/actions/fetch-symbols';
import Symbols from '@/features/symbols';

const SymbolsPage = async () => {
  const symbols = await fetchSymbols();

  return (
    <div className='mx-auto w-full max-w-screen-2xl pb-10'>
      <Symbols symbols={symbols} />
    </div>
  );
};

export default SymbolsPage;
