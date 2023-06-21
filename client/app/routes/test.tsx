import { Container } from '@mui/material';
import { useActionData } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { Input } from '~/components/input';
import { Select } from '~/components/select';
import { SubmitButton } from '~/components/submit';

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
  console.log('Creating Account...', { name, type });

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
