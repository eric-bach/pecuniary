'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import AccountForm from './account-form';
import * as z from 'zod';
import { schema } from './account-form';
import { editExistingAccount } from '@/actions';
import { useOpenAccount } from '@/hooks/use-open-account';

const EditAccountSheet = () => {
  // const [isLoading, setLoading] = useState(true);
  const { isOpen, onClose, account } = useOpenAccount();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    console.log('Account Sheet values', { values });

    // TODO Fix this
    // @ts-ignore
    const result = await editExistingAccount(values);
    console.log('Edit Account Sheet result', { result });

    onClose();
  };

  // function getAccount(id: string, callback: (account: Account) => void): void {
  //   (async function () {
  //     const account = await fetchAccount(id);
  //     callback(account);
  //   })();
  // }

  // let defaultValues;
  // function handleAccount(account: Account) {
  //   defaultValues = account
  //     ? {
  //         accountId: account.accountId,
  //         name: account.name,
  //         category: account.category,
  //         type: account.type,
  //         createdAt: account.createdAt,
  //         updatedAt: account.updatedAt,
  //       }
  //     : {};

  //   setLoading(false);
  //   console.log('defaultValues', defaultValues);
  // }

  // // Call getAccount and pass the callback function
  // getAccount(id || '', handleAccount);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='min-w-[600px] sm:w-[480px]'>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit account</SheetDescription>
          </SheetHeader>

          <AccountForm account={account} onSubmit={onSubmit} disabled={false} defaultValues={account} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditAccountSheet;
