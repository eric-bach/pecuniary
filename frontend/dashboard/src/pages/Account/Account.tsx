import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import Loading from '../../components/Loading';
import UserContext from '../../contexts/UserContext';
import TransactionsList from '../Transaction/TransactionsList';
import { CREATE_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT, GET_ACCOUNT } from './graphql/graphql';
import { AccountProps, AccountViewModel, CreateAccountInput, DeleteAccountInput, UpdateAccountInput } from './types/Account';

enum MODE {
  CREATE,
  VIEW,
  EDIT,
}

export default function Account(props: AccountProps) {
  const { id: aggregateId }: { id: string } = useParams();
  const [account, setAccount] = useState(props.location.state?.account ?? undefined);
  const [mode, setMode] = useState(aggregateId ? MODE.VIEW : MODE.CREATE);
  const [button, setButton] = useState('');
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
        aggregateId,
      },
    });
  }

  useEffect(() => {
    // Get the logged in username
    let u = localStorage.getItem('userId');
    if (u) {
      setUserId(u);
    }

    if (account) {
      formik.values.name = account.name;
      formik.values.type = account.type;
      formik.values.description = account.description;
    } else if (!account && aggregateId) {
      // Loading URL directly with aggregateId
      getAccount().then((resp) => {
        console.log('[ACCOUNT] Found Account response:', resp);

        let acc = resp.data?.getAccounts?.items[0];

        if (!acc) {
          console.log('[ACCOUNT] No Account found matching:', aggregateId);
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

  const handleSubmit = (values: any) => {
    switch (button) {
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
    console.log('[ACCOUNT] Deleting Account:', aggregateId);

    const params: DeleteAccountInput = {
      deleteAccountInput: {
        userId: userId,
        aggregateId: aggregateId,
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
      name: '',
      type: '',
      description: '',
    },
    validationSchema: yup.object({
      name: yup.string().required('Please enter an Account name'),
      type: yup.string().required('Please select an Account type'),
      description: yup.string().required('Please enter an Account description'),
    }),
    onSubmit: (values) => {
      console.log('Formik Submitting:', values);
      handleSubmit(values);
    },
  });
  // Wait until account is loaded if an aggregateId is passed in the URL
  if (!account && aggregateId) {
    return <Loading />;
  }

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4'>Add Account</Typography>
      <form onSubmit={formik.handleSubmit}>
        {mode === MODE.VIEW && (
          <Button id='toggleEdit' name='toggleEdit' variant='contained' color='primary' onClick={toggleEdit}>
            Edit
          </Button>
        )}
        {mode === MODE.EDIT && (
          <>
            <Button
              id='edit'
              name='edit'
              type='submit'
              variant='contained'
              color='success'
              onClick={(e) => {
                //@ts-ignore
                setButton(e.target.id);
                formik.handleSubmit;
              }}
            >
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
              onClick={(e) => {
                //@ts-ignore
                setButton(e.target.id);
                formik.handleSubmit;
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
          sx={{ width: '100%' }}
        />

        <FormControl sx={{ width: '100%' }}>
          <TextField
            select
            id='type'
            name='type'
            label='Account type'
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            variant='outlined'
            margin='normal'
            sx={{ width: '100%' }}
          >
            {accountTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText>{formik.errors.type && formik.touched.type && formik.errors.type}</FormHelperText>
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
          sx={{ width: '100%' }}
        />

        {mode === MODE.CREATE && (
          <Button
            id='create'
            name='create'
            type='submit'
            variant='contained'
            color='primary'
            onClick={(e) => {
              //@ts-ignore
              setButton(e.target.id);
              formik.handleSubmit;
            }}
          >
            Submit
          </Button>
        )}
      </form>
      {mode !== MODE.CREATE && (
        <>
          <Typography variant='h4'>Transactions</Typography>
          <Button name='addTransaction' variant='contained' href='/app/transactions/new'>
            Add Transaction
          </Button>
          <TransactionsList aggregateId={account.aggregateId} />
        </>
      )}
    </Container>
  );
}
