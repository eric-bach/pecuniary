import React, { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props<TData> {
  type: String;
  items: TData[];
  defaultValue?: string;
  onCreate: (name: string) => void;
  onChange: (value: string) => void;
}

function Combobox<TData>({ type, items, defaultValue, onCreate, onChange }: Props<TData>) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue ?? '');

  useEffect(() => {
    if (!value) {
      return;
    }

    // when the value change, call the on Change callback
    onChange(value);
  }, [value, onChange]);

  async function handleChange(event: any) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault();

      setValue(event.target.value);

      onCreate(event.target.value);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
          {/* TODO Find the selected category instead of the value */}
          {/* {selectedCategory ? <CategoryRow category={selectedCategory} /> : 'Select category'} */}
          {value ? value : `Select ${type.toLowerCase()}`}
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[550px] p-0'>
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput onKeyDown={(e) => handleChange(e)} placeholder={`Search or create a new ${type.toLowerCase()}...`} />
          <CommandEmpty>
            <p>No results</p>
            <p className='text-xs text-muted-foreground'>Press &apos;Enter&apos; or &apos;Tab&apos; to create one</p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {items.map((item: any) => (
                <CommandItem
                  key={item.pk}
                  onSelect={(currentvalue) => {
                    setValue(item.name);
                    setOpen((prev) => !prev);
                  }}
                >
                  <Check className={cn('mr-2 w-4 h-4 opacity-0', value === item.name && 'opacity-100')} />
                  <ComboboxRow item={item} />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ComboboxRow({ item }: { item: any }) {
  return (
    <div className='flex w-full items-center gap-2'>
      <span>{item.name}</span>
    </div>
  );
}

export default Combobox;
