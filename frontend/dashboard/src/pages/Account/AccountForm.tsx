import React, { useEffect, useState, useContext } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { CreateAccountInput } from './types/Account';
import UserContext from '../../contexts/UserContext';

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(createAccountInput: $createAccountInput) {
      userId
      aggregateId
      entity
      type
      name
      description
      createdAt
    }
  }
`;

export default function AccountForm({ account }: any) {
  const [userId, setUserId] = useState('');
  const client = useContext(UserContext);
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT);

  const accountTypes: string[] = ['TFSA', 'RRSP'];

  console.log('APOLLO CLIENT: ', client);

  useEffect(() => {
    account
      ? console.log(`[ACCOUNT FORM] Aggregate Id ${account.aggregateId} exists. Edit Account mode enabled`)
      : console.log('[ACCOUNT FORM] Aggregate Id does not exist.  Create Account mode enabled');

    // Get the logged in username
    let u = localStorage.getItem('userId');
    if (u) {
      setUserId(u);
    }
  }, [account]);

  const createOrUpdateAccount = (name: string, accountType: string, description: string) => {
    if (!account) {
      console.log('[ACCOUNT FORM] Creating Account...');

      const params: CreateAccountInput = {
        createAccountInput: {
          userId,
          type: accountType,
          name,
          description,
        },
      };

      console.log(params);

      createAccountMutation({
        variables: params,
      })
        .then((res: any) => {
          console.log('[ACCOUNT FORM] Account created successfully');

          setTimeout(() => {
            window.location.pathname = '/app/accounts';
          }, 1000);
        })
        .catch((err: any) => {
          console.error('[ACCOUNT FORM] Error occurred creating account');
          console.error(err);
        });
    } else {
    }
  };

  const formik = useFormik({
    initialValues: {
      name: account ? account.name : '',
      accountType: account ? account.type : '',
      description: account ? account.description : '',
    },
    validationSchema: yup.object({
      name: yup.string().required('Please enter an Account name'),
      accountType: yup.string().required('Please select an Account type'),
      description: yup.string().required('Please enter an Account description'),
    }),
    onSubmit: (values) => {
      createOrUpdateAccount(values.name, values.accountType, values.description);
    },
  });

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4'>Add Account </Typography>
      <Box component='form' alignItems='left' sx={{ width: '50%' }} noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
        <TextField
          id='name'
          name='name'
          label='Account name'
          placeholder='Account name'
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          variant='outlined'
          margin='normal'
          required
          fullWidth
          autoFocus
        />
        <FormControl sx={{ width: '100%' }}>
          <InputLabel>Account Type</InputLabel>
          <Select
            id='accountType'
            name='accountType'
            label='Account Type'
            value={formik.values.accountType}
            onChange={formik.handleChange}
            displayEmpty
            sx={{ width: '100%' }}
          >
            {accountTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id='description'
          name='description'
          label='Account description'
          placeholder='Account description'
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          variant='outlined'
          margin='normal'
          required
          fullWidth
          autoFocus
        />
        <Button type='submit' variant='contained' color='primary'>
          Submit
        </Button>
      </Box>
    </Container>
  );
}
