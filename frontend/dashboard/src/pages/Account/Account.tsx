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

import { CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT, GET_ACCOUNT } from './graphql/graphql';
import Loading from '../../components/Loading';
import { AccountProps, AccountViewModel, CreateAccountInput, DeleteAccountInput, UpdateAccountInput } from './types/Account';
import UserContext from '../../contexts/UserContext';

enum MODE {
  CREATE,
  VIEW,
  EDIT,
}

export default function AccountForm(props: AccountProps) {
  const { id: aggregateId }: { id: string } = useParams();

  const [account, setAccount] = useState(props.location.state?.account ?? undefined);
  const [accountId, setAccountId] = useState(aggregateId);
  const [mode, setMode] = useState(accountId ? MODE.VIEW : MODE.CREATE);
  const [userId, setUserId] = useState('');
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT);
  const [updateAccountMutation] = useMutation(UPDATE_ACCOUNT);
  const [deleteAccountMutation] = useMutation(DELETE_ACCOUNT);

  const client: any = useContext(UserContext);

  const accountTypes: string[] = ['TFSA', 'RRSP'];

  async function getAccount() {
    return await client.query({
      query: GET_ACCOUNT,
      variables: {
        userId: localStorage.getItem('userId'),
        aggregateId: accountId,
      },
    });
  }

  useEffect(() => {
    // Get the logged in username
    let u = localStorage.getItem('userId');
    if (u) {
      setUserId(u);
    }

    // Loading URL directly with aggregateId
    if (!account && aggregateId) {
      getAccount().then((resp) => {
        console.log('[ACCOUNT] Found Account response:', resp);

        let acc = resp.data?.getAccounts?.items[0];

        if (!acc) {
          console.log('[ACCOUNT] No Account found matching:', accountId);
          window.location.pathname = '/app/accounts';
        }

        formik.values.name = acc.name;
        formik.values.type = acc.type;
        formik.values.description = acc.description;
        setAccount(acc);
      });
    }
  }, [account]);

  const toggleEdit = () => {
    setMode(mode === MODE.VIEW ? MODE.EDIT : MODE.VIEW);
  };

  const handleClick = (event: any, values: AccountViewModel) => {
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

  const createAccount = (values: AccountViewModel) => {
    console.log('[ACCOUNT] Creating Account...');

    const params: CreateAccountInput = {
      createAccountInput: {
        ...values,
        userId: `${userId}`,
      },
    };

    createAccountMutation({
      variables: params,
    })
      .then(() => {
        console.log('[ACCOUNT] Account created successfully');
        setTimeout(() => {
          window.location.pathname = '/app/accounts';
        }, 1000);
      })
      .catch((err) => {
        console.error('[ACCOUNT] Error creating account', err);
      });
  };

  const updateAccount = (values: AccountViewModel) => {
    console.log('[ACCOUNT] Updating Account...');

    const params: UpdateAccountInput = {
      updateAccountInput: {
        ...values,
        userId: `${userId}`,
        sk: account.sk,
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
        console.error('[ACCOUNT] Error updating account', err);
      });
  };

  const deleteAccount = () => {
    console.log('[ACCOUNT] Deleting Account:', accountId);

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
        console.error('[ACCOUNT] Error deleting account', err);
      });
  };

  const formik = useFormik({
    initialValues: {
      name: account?.name,
      type: account?.type ?? '',
      description: account?.description,
    },
    validationSchema: yup.object({
      name: yup.string().required('Please enter an Account name'),
      type: yup.string().required('Please select an Account type'),
      description: yup.string().required('Please enter an Account description'),
    }),
    onSubmit: (values) => {
      handleClick(event, values);
    },
  });

  // Wait until account is loaded if an aggregateId is passed in the URL
  if (!account && aggregateId) {
    return <Loading />;
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4'>Add Account</Typography>
      <Box component='form' alignItems='left' sx={{ width: '50%' }} noValidate autoComplete='off' onSubmit={formik.handleSubmit}>
        {mode === MODE.VIEW && (
          <Button variant='contained' color='primary' onClick={toggleEdit}>
            Edit
          </Button>
        )}
        {mode === MODE.EDIT && (
          <>
            <Button id='edit' name='edit' type='submit' variant='contained' color='success'>
              Update
            </Button>
            <Button
              id='delete'
              name='delete'
              type='submit'
              variant='contained'
              color='error'
              sx={{
                ml: 1,
              }}
            >
              Delete
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={toggleEdit}
              sx={{
                ml: 1,
              }}
            >
              Cancel
            </Button>
          </>
        )}
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
          disabled={mode === MODE.VIEW}
          autoFocus
        />
        <FormControl sx={{ width: '100%' }}>
          <InputLabel>Account Type</InputLabel>
          <Select
            id='type'
            name='type'
            label='Account Type'
            value={formik.values.type}
            onChange={formik.handleChange}
            disabled={mode === MODE.VIEW}
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
          disabled={mode === MODE.VIEW}
          fullWidth
        />
        {mode === MODE.CREATE && (
          <Button id='create' name='create' type='submit' variant='contained' color='primary'>
            Submit
          </Button>
        )}
      </Box>
    </Container>
  );
}
