import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { CREATE_TRANSACTION, UPDATE_TRANSACTION, DELETE_TRANSACTION } from './graphql/graphql';
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  DeleteTransactionInput,
  TransactionReadModel,
  TransactionsProps,
  TransactionViewModel,
} from './types/Transaction';
import { useMutation } from '@apollo/client';

enum MODE {
  CREATE,
  VIEW,
  EDIT,
}

const Transaction = (props: TransactionsProps) => {
  const { id: aggregateId }: { id: string } = useParams();
  const [transaction, setTransaction] = useState(props.location?.state?.transaction ?? undefined);
  const [mode, setMode] = useState(transaction ? MODE.EDIT : MODE.CREATE);
  const [button, setButton] = useState('');
  const [userId, setUserId] = useState('');

  const [createTransactionMutation] = useMutation(CREATE_TRANSACTION);
  const [updateTransactionMutation] = useMutation(UPDATE_TRANSACTION);
  const [deleteTransactionMutation] = useMutation(DELETE_TRANSACTION);

  const transactionTypes: string[] = ['Buy', 'Sell'];

  useEffect(() => {
    // Get the logged in username
    let u = localStorage.getItem('userId');
    if (u) {
      setUserId(u);
    }

    if (transaction) {
      console.log(transaction);
      formik.values.type = transaction.type;
      formik.values.transactionDate = new Date(transaction.transactionDate);
      formik.values.symbol = transaction.symbol;
      formik.values.shares = transaction.shares;
      formik.values.price = transaction.price;
      formik.values.commission = transaction.commission;
    }
  }, []);

  const handleSubmit = (values: TransactionViewModel) => {
    switch (button) {
      case 'create':
        createTransaction(values);
        break;
      case 'edit':
        updateTransaction(values);
        break;
      case 'delete':
        deleteTransaction(values);
        break;
    }
  };

  const createTransaction = (values: TransactionViewModel) => {
    console.log('[TRANSACTION] Creating Transaction...');
    console.log('[TRANSACTION] Aggregate Id...', aggregateId);

    const params: CreateTransactionInput = {
      createTransactionInput: {
        ...values,
        transactionDate: values.transactionDate.toISOString().substring(0, 10),
        aggregateId: aggregateId,
        userId: `${userId}`,
      },
    };

    createTransactionMutation({
      variables: params,
    })
      .then(() => {
        console.log('[TRANSACTION] Transaction created successfully');
        setTimeout(() => {
          window.location.pathname = '/app/accounts';
        }, 1000);
      })
      .catch((err: any) => {
        console.error('[TRANSACTION] Error creating transaction', err);
      });
  };

  const updateTransaction = (values: TransactionViewModel) => {
    console.log('[TRANSACTION] Updating Transaction...');

    const params: UpdateTransactionInput = {
      updateTransactionInput: {
        ...values,
        userId: `${userId}`,
        transactionDate: values.transactionDate.toISOString().substring(0, 10),
        sk: transaction?.sk ?? '',
        aggregateId: aggregateId,
      },
    };

    updateTransactionMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[TRANSACTION] Transaction updated successfully');

        window.location.pathname = '/app/accounts';
      })
      .catch((err) => {
        console.error('[TRANSACTION] Error occurred updating transaction', err);
      });
  };

  const deleteTransaction = (values: TransactionReadModel) => {
    console.log('[TRANSACTION] Deleting Transaction...');

    const params: DeleteTransactionInput = {
      deleteTransactionInput: {
        userId: userId,
        sk: transaction?.sk ?? '',
        aggregateId: aggregateId,
        symbol: `${values.symbol}`,
      },
    };

    deleteTransactionMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[TRANSACTION] Transaction deleted successfully');
        window.location.pathname = '/app/accounts';
      })
      .catch((err) => {
        console.error('[TRANSACTION] Error occurred deleting transaction', err);
      });
  };

  const formik = useFormik({
    initialValues: {
      type: '',
      transactionDate: new Date(),
      symbol: '',
      shares: 0,
      price: 0,
      commission: 0,
    },
    validationSchema: yup.object({
      type: yup.string().required('Please select a transaction type'),
      transactionDate: yup.string().required('Please enter a transaction date'),
      symbol: yup
        .string()
        .required('Please enter a symbol')
        .matches(/[A-Za-z]{2,4}[\S]*/, 'Stock symbol is invalid'),
      shares: yup.number().required('Please enter the number of shares').min(1, 'Number of shares is invalid'),
      price: yup.number().required('Please enter the share price').min(0.01, 'Price is invalid'),
      commission: yup.string().required('Please enter the commission').min(0, 'Commission is invalid'),
    }),
    onSubmit: (values: TransactionViewModel) => {
      console.log('Formik Submitting:', values);
      handleSubmit(values);
    },
  });

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4'>{mode === MODE.CREATE ? 'Add' : 'Edit'} Transaction</Typography>
      <form onSubmit={formik.handleSubmit}>
        <FormControl sx={{ width: '100%' }}>
          <TextField
            select
            id='type'
            name='type'
            label='Transaction type'
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            variant='outlined'
            margin='normal'
            sx={{ width: '20%' }}
          >
            {transactionTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText>{formik.errors.type && formik.touched.type && formik.errors.type}</FormHelperText>
        </FormControl>

        <Box sx={{ width: '20%' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Transaction Date'
              value={formik.values.transactionDate}
              onChange={(value) => {
                formik.setFieldValue('transactionDate', value);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>

        <Box>
          <TextField
            id='symbol'
            name='symbol'
            label='Symbol'
            placeholder='Symbol'
            value={formik.values.symbol}
            onChange={formik.handleChange}
            error={formik.touched.symbol && Boolean(formik.errors.symbol)}
            helperText={formik.touched.symbol && formik.errors.symbol}
            variant='outlined'
            margin='normal'
            sx={{ width: '20%' }}
          />
        </Box>

        <Box>
          <TextField
            id='shares'
            name='shares'
            label='Shares'
            placeholder='Shares'
            value={formik.values.shares}
            onChange={formik.handleChange}
            error={formik.touched.shares && Boolean(formik.errors.shares)}
            helperText={formik.touched.shares && formik.errors.shares}
            variant='outlined'
            margin='normal'
            sx={{ width: '20%' }}
          />
        </Box>

        <Box>
          <TextField
            id='price'
            name='price'
            label='Price'
            placeholder='Price'
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            variant='outlined'
            margin='normal'
            sx={{ width: '20%' }}
          />
        </Box>

        <Box>
          <TextField
            id='commission'
            name='commission'
            label='Commission'
            placeholder='Commission'
            value={formik.values.commission}
            onChange={formik.handleChange}
            error={formik.touched.commission && Boolean(formik.errors.commission)}
            helperText={formik.touched.commission && formik.errors.commission}
            variant='outlined'
            margin='normal'
            sx={{ width: '20%' }}
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Button
            id={mode === MODE.CREATE ? 'create' : 'edit'}
            name={mode === MODE.CREATE ? 'create' : 'edit'}
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
          {mode === MODE.EDIT && (
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
          )}
        </Box>
      </form>
    </Container>
  );
};

export default Transaction;
