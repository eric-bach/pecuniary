import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from './graphql/graphql';
import UserContext from '../../contexts/UserContext';
import Loading from '../../components/Loading';
import { AccountProps, CreateAccountInput, DeleteAccountInput, UpdateAccountInput } from './types/Account';

const mockAccount = {
  userId: 'mock.user',
  sk: 'ACC#TEST',
  aggregateId: '999',
  type: 'TFSA',
  name: 'Mock Account',
  description: 'Mock Test Account',
  currencies: [
    {
      currency: 'CAD',
      bookValue: 0,
      marketValue: 0,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function AccountForm(props: AccountProps) {
  const { id: aggregateId }: { id: string } = useParams();

  const [account, setAccount] = useState(props.location.state?.account ?? undefined);
  const [accountId, setAccountId] = useState(aggregateId);
  const [mode, setMode] = useState(accountId ? 'view' : 'create');
  const [userId, setUserId] = useState('');
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT);
  const [updateAccountMutation] = useMutation(UPDATE_ACCOUNT);
  const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);
  const client = useContext(UserContext);

  const accountTypes: string[] = ['TFSA', 'RRSP'];

  console.log('ACCOUNT: ', account);
  console.log('ACCOUNT ID: ', accountId);
  console.log('APOLLO CLIENT: ', client);

  useEffect(() => {
    // Get the logged in username
    let u = localStorage.getItem('userId');
    if (u) {
      setUserId(u);
    }

    // Loading URL directly with aggregateId
    if (!account && aggregateId) {
      // TODO Fetch from backend API instead
      setAccount(mockAccount);

      formik.values.name = mockAccount.name;
      formik.values.accountType = mockAccount.type;
      formik.values.description = mockAccount.description;
    }
  }, []);

  const toggleEdit = () => {
    setMode(mode === 'view' ? 'edit' : 'view');
  };

  const handleClick = (event: any, values: any) => {
    // TODO Take event and values to CREATE, UPDATE, or DELETE
    console.log('Event:', event.submitter.id);
    console.log('Values:', values);

    switch (event.submitter.id) {
      case 'create':
        createAccount(values);
        break;
      case 'edit':
        updateAccount(values);
        break;
      case 'delete':
        deleteAccount();
        break;
    }
  };

  const createAccount = (values: any) => {
    console.log('[ACCOUNT FORM] Creating Account...');

    const params: CreateAccountInput = {
      createAccountInput: {
        userId: `${userId}`,
        type: `${values.accountType}`,
        name: `${values.name}`,
        description: `${values.description}`,
      },
    };

    createAccountMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[ACCOUNT] Account created successfully');
        setTimeout(() => {
          window.location.pathname = '/app/accounts';
        }, 1000);
      })
      .catch((err) => {
        console.error('[ACCOUNT] Error occurred creating account');
        console.error(err);
      });
  };

  const updateAccount = (values: any) => {
    console.log('[ACCOUNT] Updating Account...');

    const params: UpdateAccountInput = {
      updateAccountInput: {
        userId: `${userId}`,
        sk: account.sk,
        type: `${values.accountType}`,
        name: `${values.name}`,
        description: `${values.description}`,
      },
    };

    updateAccountMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[ACCOUNT] Account updated successfully');
        window.location.pathname = '/app/accounts';
      })
      .catch((err) => {
        console.error('[ACCOUNT] Error occurred updating account');
        console.error(err);
      });
  };

  const deleteAccount = () => {
    console.log('[ACCOUNT] Deleting Account: ', accountId);

    const params: DeleteAccountInput = {
      deleteAccountInput: {
        userId: userId,
        aggregateId: accountId,
      },
    };
    deleteAccountMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[ACCOUNT] Account deleted successfully');
        window.location.pathname = '/app/accounts';
      })
      .catch((err) => {
        console.error('[ACCOUNT] Error occurred deleting account');
        console.error(err);
      });
  };

  const formik = useFormik({
    initialValues: {
      name: account?.name,
      accountType: account?.type ?? '',
      description: account?.description,
    },
    validationSchema: yup.object({
      name: yup.string().required('Please enter an Account name'),
      accountType: yup.string().required('Please select an Account type'),
      description: yup.string().required('Please enter an Account description'),
    }),
    onSubmit: (values) => {
      handleClick(event, values);
    },
  });

  if (!account && aggregateId) return <Loading />;

  console.log('Mode:', mode);

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4'>Add Account</Typography>
      <Box component='form' alignItems='left' sx={{ width: '50%' }} noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
        {mode === 'view' && (
          <Button variant='contained' color='primary' onClick={toggleEdit}>
            Edit
          </Button>
        )}
        {mode === 'edit' && (
          <>
            <Button id='edit' name='edit' type='submit' variant='contained' color='success'>
              Update
            </Button>
            <Button id='delete' name='delete' type='submit' variant='contained' color='error'>
              Delete
            </Button>
            <Button variant='contained' color='primary' onClick={toggleEdit}>
              Cancel
            </Button>
          </>
        )}{' '}
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
          disabled={mode === 'view'}
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
            disabled={mode === 'view'}
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
          disabled={mode === 'view'}
          fullWidth
        />
        {mode === 'create' && (
          <Button id='create' name='create' type='submit' variant='contained' color='primary'>
            Submit
          </Button>
        )}
      </Box>
    </Container>
  );
}
