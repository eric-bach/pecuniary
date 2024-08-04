import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createNewPayee } from '@/actions';
import { fetchPayees } from '@/actions/fetch-payees';
import { Payee } from '../../../../../backend/src/appsync/api/codegen/appsync';

function CategoryPicker() {
  const [open, setOpen] = React.useState(false);
  const [payees, setPayees] = useState<Payee[]>([]);
  const [value, setValue] = React.useState('');

  useEffect(() => {
    fetchAllPayees();
  }, []);

  async function fetchAllPayees() {
    setPayees(await fetchPayees());
  }

  async function createPayee(event: any) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();

      const result = await createNewPayee(event.target.value);

      setValue(event.target.value);
      await fetchAllPayees();
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
          {/* TODO Find the selected category instead of the value */}
          {/* {selectedCategory ? <CategoryRow category={selectedCategory} /> : 'Select category'} */}
          {value ? value : 'Select category'}
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[550px] p-0'>
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput onKeyDown={(e) => createPayee(e)} placeholder='Search or create a category...' />
          <CommandEmpty>
            <p>Category not found</p>
            <p className='text-xs text-muted-foreground'>Press 'Enter' or 'Tab' to create</p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {payees.map((category) => (
                <CommandItem
                  key={category.pk}
                  onSelect={(currentvalue) => {
                    setValue(category.name);
                    setOpen((prev) => !prev);
                  }}
                >
                  <Check className={cn('mr-2 w-4 h-4 opacity-0', value === category.name && 'opacity-100')} />
                  <CategoryRow category={category} />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CategoryRow({ category }: { category: any }) {
  return (
    <div className='flex w-full items-center gap-2'>
      <span>{category.name}</span>
    </div>
  );
}

export default CategoryPicker;
