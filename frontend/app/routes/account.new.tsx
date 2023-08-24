import type { ActionFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Container } from '@mui/material';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { withZod } from '@remix-validated-form/with-zod';
import gql from 'graphql-tag';

import { getClient } from '~/utils/session.server';
import { CREATE_ACCOUNT } from '~/graphql/queries';
import type { Account } from '~/types/types';
import { ValidatedForm, validationError } from 'remix-validated-form';

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

  try {
    const validation = await validator.validate(formData);

    if (validation.error) {
      return validationError(validation.error);
    }

    const { name, type } = validation.data;

    const input = {
      name: name,
      type: type,
    };

    // Save account
    const client = await getClient(request);
    const result = await client.mutate<Account>({
      mutation: gql(CREATE_ACCOUNT),
      variables: { input: input },
    });

    console.debug('Create Account Result', result);

    return redirect('/account');
  } catch (errors) {
    console.log('Create Account Errors', JSON.stringify({ errors }));
    return { errors };
  }
};

export default function () {
  // const actionData = useActionData();

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
