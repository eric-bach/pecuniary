import { Form, Link, useActionData } from '@remix-run/react';
import { ActionFunction, redirect } from '@remix-run/node';
import { Button, Container, FormControl, MenuItem, Select, InputLabel, TextField } from '@mui/material';
import * as Yup from 'yup';
import { getClient } from '~/utils/session.server';
import gql from 'graphql-tag';
import { Account } from '~/types/types';
import { CREATE_ACCOUNT } from '~/graphql/queries';

const accountTypes: string[] = ['TFSA', 'RRSP'];

const validateForm = async (formData: FormData) => {
  const getValidationErrors = (err: any) => {
    const validationErrors = {} as any;

    err.inner.forEach((error: any) => {
      if (error.path) {
        validationErrors[error.path] = error.message;
      }
    });

    return validationErrors;
  };

  const formJSON: { [key: string]: any } = {};
  for (var key of formData.keys()) {
    formJSON[key] = formData.get(key);
  }

  const schema = Yup.object({
    name: Yup.string().required('Account name is required'),
    type: Yup.string().required('Account type is required'),
  });

  try {
    const data = await schema.validate(formJSON, { abortEarly: false });
    return data;
  } catch (error) {
    throw getValidationErrors(error);
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  try {
    const data = await validateForm(formData);
    console.log('data', data);

    const input = {
      name: data.name,
      type: data.type,
    };
    console.log(input);

    // Save account
    const client = await getClient(request);
    console.log(request);
    const result = await client.mutate<Account>({
      mutation: gql(CREATE_ACCOUNT),
      variables: { input: input },
    });

    console.log(result);

    return redirect('/account');
  } catch (errors) {
    return { errors };
  }
};

export default function NewProject() {
  const actionData = useActionData();

  return (
    <Container maxWidth='lg'>
      <Form method='post' action='/account/new' noValidate={true}>
        <TextField
          id='name'
          name='name'
          type='text'
          label='Account name'
          placeholder='Account name'
          error={actionData?.errors['name'] !== undefined}
          helperText={actionData?.errors['name']}
          variant='outlined'
          margin='normal'
          sx={{ width: '100%' }}
        />

        <FormControl sx={{ width: '100%' }}>
          <TextField
            select
            id='type'
            name='type'
            type='select'
            label='Account type'
            defaultValue=''
            error={actionData?.errors['type'] !== undefined}
            helperText={actionData?.errors['type']}
            variant='outlined'
            margin='normal'
          >
            {accountTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>

        <Button id='create' name='create' type='submit' variant='contained' color='primary'>
          Create
        </Button>
      </Form>
    </Container>
  );
}
