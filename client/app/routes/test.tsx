// Submit

import { Button } from '@mui/material';
import { useIsSubmitting } from 'remix-validated-form';

export const SubmitButton = ({ submitText = 'Submit' }: { submitText?: string }) => {
  const isSubmitting = useIsSubmitting();

  return (
    <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : submitText}
    </Button>
  );
};

// Input

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

// Select

import { MenuItem, FormControl } from '@mui/material';

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

// Form

import { Container } from '@mui/material';
import { Form, useActionData } from '@remix-run/react';
import { ActionArgs, ActionFunction } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const accountTypes: string[] = ['TFSA', 'RRSP'];

const createPostSchema = zfd.formData({
  name: z.string().nonempty('Account name is required'),
  type: z.string().nonempty('Account type is required'),
});

export type CreatePostType = z.infer<typeof createPostSchema>;

const validator = withZod(createPostSchema);

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const validation = await validator.validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, type } = validation.data;
  console.log('Creating Post...', { name, type });

  return null;
};

export default function () {
  const actionData = useActionData();

  return (
    <Container>
      <ValidatedForm validator={validator} method='post'>
        <Input name='name' title='Account name' />
        <Select name='type' title='Account type' options={accountTypes} />

        <SubmitButton submitText='Create Post' />
      </ValidatedForm>
    </Container>
  );
}
