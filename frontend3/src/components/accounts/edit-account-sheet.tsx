import { Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import AccountForm from './account-form';
import * as z from 'zod';
import { schema } from './account-form';
import { useNewAccount } from '@/hooks/use-new-account';
import { Account } from '../../../../infrastructure/graphql/api/codegen/appsync';
import { editExistingAccount } from '@/actions';

const EditAccountSheet = ({ account }: { account: Account }) => {
  const { onOpen, isOpen, onClose } = useNewAccount();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    console.log('Account Sheet values', { values });

    // @ts-ignore
    const result = await editExistingAccount(values);
    console.log('Edit Account Sheet result', { result });

    onClose();
  };

  return (
    <>
      <Button variant='outline' size='icon' color='primary' onClick={onOpen} className='mr-2'>
        <Edit size={20} />
      </Button>

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='min-w-[600px] sm:w-[480px]'>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit account</SheetDescription>
          </SheetHeader>
          <AccountForm
            id={account.accountId}
            onSubmit={onSubmit}
            disabled={false}
            defaultValues={{
              accountId: account.accountId,
              createdAt: account.createdAt,
              name: account.name,
              category: account.category,
              type: account.type,
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditAccountSheet;
