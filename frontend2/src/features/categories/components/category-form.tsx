import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from '@/types/category';
import * as z from 'zod';

type Props = {
  defaultValues?: z.infer<typeof schema>;
  onSubmit: (values: z.infer<typeof schema>) => void;
  onClose: () => void;
  disabled?: boolean;
};

const CategoryForm = ({ defaultValues, onSubmit, onClose, disabled }: Props) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log('Submitting', data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pt-4'>
        <FormField
          control={form.control}
          name='pk'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='hidden' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Name</FormLabel>
              <FormControl>
                <Input
                  className='border-zinc-200 dark:bg-slate-500 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                  placeholder='Name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className='pt-2'>
          <Button onClick={onClose} variant='outline' disabled={disabled}>
            Cancel
          </Button>
          <Button type='submit' disabled={disabled}>
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CategoryForm;
