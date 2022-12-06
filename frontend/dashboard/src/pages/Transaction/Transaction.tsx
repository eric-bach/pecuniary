import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useFormik } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import * as yup from 'yup';

const Transaction = () => {
  const [transactionDate, setTransactionDate] = React.useState<Dayjs | null>(dayjs(new Date()));

  const handleTransactionDateChange = (date: Dayjs | null) => {
    setTransactionDate(date);
  };

  const transactionTypes: string[] = ['Buy', 'Sell'];

  const formik = useFormik({
    initialValues: {
      type: '',
      transactionDate: new Date(),
      symbol: '',
      shares: 0,
      price: 0,
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
    onSubmit: (values) => {
      console.log('Formik Submitting:', values);
      //handleSubmit(values);
    },
  });

  return (
    <Container maxWidth='lg'>
      <Typography variant='h4'>Add Transaction</Typography>
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
            sx={{ width: '25%' }}
          >
            {transactionTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText>{formik.errors.type && formik.touched.type && formik.errors.type}</FormHelperText>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label='Transaction date'
            inputFormat='MM/DD/YYYY'
            value={transactionDate}
            onChange={handleTransactionDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <Button
          id='create'
          name='create'
          type='submit'
          variant='contained'
          color='primary'
          onClick={(e) => {
            formik.handleSubmit;
          }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default Transaction;
