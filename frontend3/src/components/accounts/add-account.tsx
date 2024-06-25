'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().min(1, 'Name cannot be blank'),
  //   category: z
  //     .string()
  //     .refine(
  //       (value: string) => value === 'Banking' || value === 'Credit Card' || value === 'Investment' || value === 'Asset',
  //       'Category is not a valid type'
  //     ),
  //   type: z.string().refine((value: string) => value === 'TFSA' || value === 'RRSP', 'Type must be either TFSA or RRSP'),
});

const AddAccountButton = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <Button color='primary'>Add Account</Button>
        </SheetTrigger>
        <SheetContent className='min-w-[600px] sm:w-[480px]'>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <SheetHeader>
              <SheetTitle>Create Account</SheetTitle>
              <SheetDescription>Add a new account</SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-bold text-zinc-500 dark:text-white'>Account Name</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                        placeholder='Account name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
            <SheetFooter>
              <SheetClose asChild>
                <Button type='submit'>Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AddAccountButton;
