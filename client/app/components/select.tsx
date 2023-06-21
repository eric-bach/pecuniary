import { MenuItem, FormControl, TextField } from '@mui/material';
import { useField } from 'remix-validated-form';

export const Select = ({ name, title, id, options }: { name: string; title?: string; id?: string; options: string[] }) => {
  const field = useField(name);

  return (
    <FormControl sx={{ width: '100%' }}>
      <TextField
        {...field.getInputProps()}
        select
        id={id ? id : name}
        name={name}
        type='select'
        label={title}
        defaultValue=''
        placeholder={title}
        error={field.error !== undefined}
        helperText={field.error}
        variant='outlined'
        margin='normal'
      >
        {options.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};
