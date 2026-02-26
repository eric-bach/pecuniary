import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface TransactionFilters {
  payee: string;
  category: string;
  type: 'all' | 'debit' | 'credit';
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_FILTERS: TransactionFilters = {
  payee: '',
  category: '',
  type: 'all',
  dateFrom: '',
  dateTo: '',
};

interface TransactionFilterPopoverProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  categories: string[];
  payees: string[];
}

export function TransactionFilterPopover({ filters, onFiltersChange, categories, payees }: TransactionFilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.payee) count++;
    if (filters.category) count++;
    if (filters.type !== 'all') count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  }, [filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = { ...DEFAULT_FILTERS };
    setLocalFilters(cleared);
    onFiltersChange(cleared);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalFilters(filters);
    }
    setOpen(isOpen);
  };

  // Filter payee suggestions based on current input
  const filteredPayees = useMemo(() => {
    if (!localFilters.payee) return payees.slice(0, 10);
    return payees.filter((p) => p.toLowerCase().includes(localFilters.payee.toLowerCase())).slice(0, 10);
  }, [payees, localFilters.payee]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 text-sm px-3 text-gray-600 relative'>
          <Filter className='h-3.5 w-3.5 mr-1.5' />
          Filter
          {activeFilterCount > 0 && (
            <span className='absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-medium'>
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-4' align='end'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h4 className='font-medium text-sm'>Filter Transactions</h4>
            {activeFilterCount > 0 && (
              <Button variant='ghost' size='sm' className='h-6 px-2 text-xs text-gray-500 hover:text-gray-700' onClick={handleClear}>
                <X className='h-3 w-3 mr-1' />
                Clear all
              </Button>
            )}
          </div>

          {/* Payee filter */}
          <div className='space-y-2'>
            <Label htmlFor='filter-payee' className='text-xs text-gray-500'>
              Payee
            </Label>
            <Input
              id='filter-payee'
              placeholder='Search payee...'
              value={localFilters.payee}
              onChange={(e) => setLocalFilters({ ...localFilters, payee: e.target.value })}
              className='h-8 text-sm'
              list='payee-suggestions'
            />
            {filteredPayees.length > 0 && localFilters.payee && (
              <datalist id='payee-suggestions'>
                {filteredPayees.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            )}
          </div>

          {/* Category filter */}
          <div className='space-y-2'>
            <Label className='text-xs text-gray-500'>Category</Label>
            <Select
              value={localFilters.category || '_all'}
              onValueChange={(val) => setLocalFilters({ ...localFilters, category: val === '_all' ? '' : val })}
            >
              <SelectTrigger className='h-8 text-sm'>
                <SelectValue placeholder='All categories' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='_all'>All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction type filter */}
          <div className='space-y-2'>
            <Label className='text-xs text-gray-500'>Type</Label>
            <Select
              value={localFilters.type}
              onValueChange={(val) => setLocalFilters({ ...localFilters, type: val as 'all' | 'debit' | 'credit' })}
            >
              <SelectTrigger className='h-8 text-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All transactions</SelectItem>
                <SelectItem value='debit'>Expenses only</SelectItem>
                <SelectItem value='credit'>Income only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date range filter */}
          <div className='space-y-2'>
            <Label className='text-xs text-gray-500'>Date Range</Label>
            <div className='flex gap-2'>
              <Input
                type='date'
                placeholder='From'
                value={localFilters.dateFrom}
                onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
                className='h-8 text-sm flex-1'
              />
              <Input
                type='date'
                placeholder='To'
                value={localFilters.dateTo}
                onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
                className='h-8 text-sm flex-1'
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex gap-2 pt-2'>
            <Button variant='outline' size='sm' className='flex-1 h-8' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size='sm' className='flex-1 h-8 bg-[#0067c0] hover:bg-[#005bb5] text-white' onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
