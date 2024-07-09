import CurrencyInput from 'react-currency-input-field';

type AmountInputProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const AmountInput = ({ value, onChange, placeholder, disabled }: AmountInputProps) => {
  return (
    <CurrencyInput
      className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
      placeholder={placeholder}
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    />
  );
};
