import { useState } from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { Field, Formik } from 'formik';
import { Form, SubmitButton, ResetButton, Select, Input } from 'formik-semantic-ui-react';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';

import { SelectList } from '../types/SelectList';
import { UPDATE_TRANSACTION, DELETE_TRANSACTION } from './graphql/graphql';
import { TransactionFormValues, TransactionProps, UpdateTransactionInput, DeleteTransactionInput } from './types/Transaction';

import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from '@apollo/client';

const FormDatePicker = () => {
  return (
    <Field name='transactionDate'>
      {({ field, form: { setFieldValue } }: any) => {
        return (
          <>
            <div className='field'>
              <label>Transaction Date</label>
              <DatePicker
                {...field}
                placeholderText='Select transaction date'
                selected={field.value || null}
                onChange={(val: Date) => {
                  setFieldValue(field.name, val);
                }}
              />
            </div>
          </>
        );
      }}
    </Field>
  );
};

const TransactionDetail = (props: TransactionProps) => {
  const [transaction] = useState(props.location.state.transaction);
  const [updateTransactionMutation] = useMutation(UPDATE_TRANSACTION);
  const [deleteTransactionMutation] = useMutation(DELETE_TRANSACTION);

  console.log('Transaction', transaction);

  const transactionTypes: SelectList[] = [
    { key: 'Buy', text: 'Buy', value: 'Buy' },
    { key: 'Sell', text: 'Sell', value: 'Sell' },
  ];

  const updateTransaction = (values: TransactionFormValues) => {
    console.log('[TRANSACTION DETAIL] Updating Transaction...');

    const selectedTransactionType: SelectList = transactionTypes.find((a) => a.value === values.type) ?? {
      key: '',
      text: '',
      value: '',
    };

    const params: UpdateTransactionInput = {
      updateTransactionInput: {
        userId: `${transaction.userId}`,
        aggregateId: transaction.aggregateId,
        createdAt: transaction.createdAt.toString(),
        type: `${selectedTransactionType.value}`,
        transactionDate: values.transactionDate.toISOString().substring(0, 10),
        symbol: `${values.symbol}`,
        shares: values.shares,
        price: values.price,
        commission: values.commission,
      },
    };

    console.log('[TRANSACTION DETAIL] Updating Transaction with values: ', params);

    updateTransactionMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[TRANSACTION DETAIL] Transaction updated successfully');

        window.location.pathname = '/accounts';
      })
      .catch((err) => {
        console.error('[TRANSACTION DETAIL] Error occurred updating transaction');
        console.error(err);
      });
  };

  const deleteTransaction = () => {
    console.log('[TRANSACTION DETAIL] Deleting Transaction...');

    const params: DeleteTransactionInput = {
      deleteTransactionInput: {
        userId: transaction.userId,
        createdAt: transaction.createdAt.toString(),
        aggregateId: transaction.aggregateId,
        symbol: `${transaction.symbol}`,
      },
    };

    deleteTransactionMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[TRANSACTION DETAIL] Transaction deleted successfully');
        window.location.pathname = '/accounts';
      })
      .catch((err) => {
        console.error('[TRANSACTION DETAIL] Error occurred deleting transaction');
        console.error(err);
      });
  };

  return (
    <>
      <h2>Transaction Form</h2>
      <Grid>
        <Grid.Column widht={10}>
          <Segment>
            <Header sub color='teal' content='Transaction Details' />
            <Formik
              enableReinitialize
              initialValues={{
                type: transaction.type,
                transactionDate: new Date(transaction.transactionDate),
                symbol: transaction.symbol,
                shares: transaction.shares,
                price: transaction.price,
                commission: transaction.commission,
              }}
              onSubmit={(values: TransactionFormValues, actions) => {
                console.log(values);
                updateTransaction(values);
                actions.setSubmitting(false);
              }}
              onReset={(values: TransactionFormValues, actions) => {
                deleteTransaction();
                actions.setSubmitting(false);
              }}
              validationSchema={Yup.object().shape({
                type: Yup.string().required('Please select a transaction type'),
                transactionDate: Yup.string().required('Please enter a transaction date'),
                symbol: Yup.string()
                  .required('Please enter a symbol')
                  .matches(/[A-Za-z]{2,4}[\S]*/, 'Stock symbol is invalid'),
                shares: Yup.number().required('Please enter the number of shares').min(1, 'Number of shares is invalid'),
                price: Yup.number().required('Please enter the share price').min(0.01, 'Price is invalid'),
                commission: Yup.string().required('Please enter the commission').min(0, 'Commission is invalid'),
              })}
            >
              <Form size='large'>
                <Select
                  id='type'
                  name='type'
                  label='Transaction Type'
                  options={transactionTypes}
                  placeholder='Select a transaction type'
                  selection
                  //   errorPrompt
                />
                <FormDatePicker />
                <Input id='symbol' fluid name='symbol' label='Symbol' placeholder='Security symbol' errorPrompt />
                <Input id='shares' fluid name='shares' label='Shares' placeholder='Number of shares' errorPrompt />
                <Input id='price' fluid name='price' label='Price' placeholder='Price per share' errorPrompt />
                <Input id='commision' fluid name='commission' label='Commission' placeholder='Commission of trade' errorPrompt />
                <SubmitButton primary>Update</SubmitButton>
                <ResetButton>Delete</ResetButton>
              </Form>
            </Formik>
          </Segment>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default TransactionDetail;
