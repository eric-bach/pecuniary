import React, { useEffect, useState, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';

import UserContext from '../../contexts/UserContext';
import { AccountProps, DeleteAccountInput, UpdateAccountInput } from './types/Account';
import Loading from '../../components/Loading';

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

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($updateAccountInput: UpdateAccountInput!) {
    updateAccount(updateAccountInput: $updateAccountInput) {
      userId
      sk
      type
      name
      description
      updatedAt
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($deleteAccountInput: DeleteAccountInput!) {
    deleteAccount(deleteAccountInput: $deleteAccountInput) {
      userId
      aggregateId
    }
  }
`;

export default function AccountDetail(props: AccountProps) {
  const [account, setAccount] = useState(props.location.state?.account ?? undefined);
  const [userId, setUserId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updateAccountMutation] = useMutation(UPDATE_ACCOUNT);
  const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);
  const client = useContext(UserContext);

  const accountTypes: string[] = ['TFSA', 'RRSP'];

  console.log('[ACCOUNT DETAIL] Apollo Client: ', client);
  console.log('[ACCOUNT DETAIL] Account: ', account);

  useEffect(() => {
    // Get the logged in username
    let u = localStorage.getItem('userId');
    if (u) {
      setUserId(u);
    }

    // Get account
    if (!account) {
      console.log('[ACCOUNT DETAIL] No Account');

      // TODO Get Account (requires API)
      setAccount(mockAccount);
    }
  }, []);

  const enableEdit = () => {
    setEditMode(!editMode);
    console.log('edit');
  };

  const deleteAccount = () => {
    console.log('delete');

    const params: DeleteAccountInput = {
      deleteAccountInput: {
        userId: account.userId,
        aggregateId: account.aggregateId,
      },
    };
    deleteAccountMutation({
      variables: params,
    })
      .then((res: any) => {
        console.log('[ACCOUNT DETAIL] Account deleted successfully');
        //setMessageVisibility(true);

        window.location.pathname = '/app/accounts';
      })
      .catch((err: any) => {
        console.error('[ACCOUNT DETAIL] Error occurred deleting account');
        console.error(err);
      });
  };

  const updateAccount = () => {
    console.log('update');

    console.log('[ACCOUNT FORM] Updating Account...');

    const params: UpdateAccountInput = {
      updateAccountInput: {
        userId: `${userId}`,
        sk: account.sk,
        type: `${formik.values.accountType}`,
        name: `${formik.values.name}`,
        description: `${formik.values.description}`,
      },
    };

    console.log('[ACCOUNT FORM] Updating Account with values: ', params);

    updateAccountMutation({
      variables: params,
    })
      .then((res: any) => {
        console.log('[ACCOUNT FORM] Account updated successfully');

        window.location.pathname = '/app/accounts';
      })
      .catch((err: any) => {
        console.error('[ACCOUNT FORM] Error occurred updating account');
        console.error(err);
      });
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
    onSubmit: (values) => {},
  });

  if (!account) return <Loading />;

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4'>Account: {account.aggregateId}</Typography>
      {!editMode && (
        <Button variant='contained' color='primary' onClick={enableEdit}>
          Edit
        </Button>
      )}
      {editMode && (
        <>
          <Button variant='contained' color='success' onClick={updateAccount}>
            Update
          </Button>
          <Button variant='contained' color='error' onClick={deleteAccount}>
            Delete
          </Button>
          <Button variant='contained' color='primary' onClick={enableEdit}>
            Cancel
          </Button>
        </>
      )}
      <Box component='form' alignItems='left' sx={{ width: '50%' }} noValidate autoComplete='off'>
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
          fullWidth
          disabled={!editMode}
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
            disabled={!editMode}
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
          fullWidth
          disabled={!editMode}
          autoFocus
        />
      </Box>
    </Container>
  );
}
