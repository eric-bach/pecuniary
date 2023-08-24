import { useField } from 'remix-validated-form';
import { TextField } from '@mui/material';

export const Input = ({ name, title, id }: { name: string; title?: string; id?: string }) => {
  const field = useField(name);
  return (
    <TextField
      {...field.getInputProps()}
      id={id ? id : name}
      name={name}
      type='text'
      label={title}
      placeholder={title}
      error={field.error !== undefined}
      helperText={field.error}
      onClick={() => {
        field.clearError();
      }}
      onChange={() => {
        if (field.error) field.clearError();
      }}
      variant='outlined'
      margin='normal'
      sx={{ width: '100%' }}
    />
  );
};
