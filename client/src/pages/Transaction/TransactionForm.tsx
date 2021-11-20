import { useContext, useEffect, useState } from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { Formik, Field } from 'formik';
import { Form, SubmitButton, Select, Input } from 'formik-semantic-ui-react';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';
import { LIST_TRANSACTION_TYPES, CREATE_TRANSACTION } from './graphql/graphql';

import { CognitoUserSession } from '../types/CognitoUserSession';
import { SelectList, SelectListItem } from '../types/SelectList';
import { AccountProps } from '../Account/types/Account';
import { CreateTransactionInput, TransactionFormValues } from '../Transaction/types/Transaction';

import 'react-datepicker/dist/react-datepicker.css';

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

const TransactionForm = (props: AccountProps) => {
  const [username, setUsername] = useState('');
  const {
    data: transactionTypes,
    error: transactionTypesError,
    loading: transactionTypesLoading,
  } = useQuery(LIST_TRANSACTION_TYPES);
  const [createTransactionMutation] = useMutation(CREATE_TRANSACTION);
  const { getSession } = useContext(UserContext);

  useEffect(() => {
    // Get the logged in username
    getSession().then((session: CognitoUserSession) => {
      setUsername(session.idToken.payload.email);
    });
  }, [getSession]);

  // TODO Improve this Error page
  if (transactionTypesError) return 'Error!'; // You probably want to do more here!
  if (transactionTypesLoading) return <Loading />;

  const transactionTypesList: SelectList[] = [];
  transactionTypes.listTransactionTypes.map((d: SelectListItem) => {
    transactionTypesList.push({ key: d.id, text: d.name, value: d.description });
    return true;
  });

  const createTransaction = (values: TransactionFormValues) => {
    console.log('[TRANSACTION FORM] Creating Transaction...');

    const account = props.location.state.account;
    const selectedTransactionType: SelectList = transactionTypesList.find(
      (a) => a.value === values.transactionTypeName
    ) ?? {
      key: '',
      text: '',
      value: '',
    };

    // Convert transactionDate to AWSDate format
    const transactionDate = values.transactionDate.toISOString().substring(0, 10) + 'Z';
    // Sanitize numbers
    const shares = parseFloat(values.shares.toString());
    const price = parseFloat(values.price.toString());
    const commission = parseFloat(values.commission.toString());

    const params: CreateTransactionInput = {
      createTransactionInput: {
        aggregateId: account.aggregateId,
        name: 'TransactionCreatedEvent',
        data: `{ "accountId": "${account.id}", "transactionDate": "${transactionDate}", "shares": ${shares}, "price": ${price}, "commission": ${commission}, "symbol": "${values.symbol}", "transactionType":{"id":"${selectedTransactionType.key}","name":"${selectedTransactionType.text}","description":"${selectedTransactionType.value}"} }`,
        version: 1,
        userId: `${username}`,
        createdAt: new Date(),
      },
    };

    console.log('[TRANSACTION FORM]: Params', params);

    createTransactionMutation({
      variables: params,
    })
      .then((res) => {
        console.log('[TRANSACTION FORM] Transaction created successfully');

        setTimeout(() => {
          window.location.pathname = '/accounts';
        }, 1000);
      })
      .catch((err) => {
        console.error('[TRANSACTION FORM] Error occurred creating transaction');
        console.error(err);
      });
  };

  return (
    <>
      <div>
        <h2>Transaction Form</h2>
        <Grid>
          <Grid.Column widht={10}>
            <Segment>
              <Header sub color='teal' content='Transaction Details' />
              <Formik
                enableReinitialize
                initialValues={{
                  transactionTypeName: '',
                  transactionDate: new Date(),
                  symbol: '',
                  shares: 0,
                  price: 0,
                  commission: 0,
                }}
                onSubmit={(values: TransactionFormValues, actions) => {
                  console.log(values);
                  createTransaction(values);

                  actions.setSubmitting(false);
                }}
                validationSchema={Yup.object().shape({
                  transactionTypeName: Yup.string().required('Please select a transaction type'),
                  transactionDate: Yup.string().required('Please enter a transaction date'),
                  symbol: Yup.string()
                    .required('Please enter a symbol')
                    .matches(/[A-Za-z]{2,4}[\S]*/, 'Stock symbol is invalid'),
                  shares: Yup.number()
                    .required('Please enter the number of shares')
                    .min(1, 'Number of shares is invalid'),
                  price: Yup.number().required('Please enter the share price').min(0.01, 'Price is invalid'),
                  commission: Yup.string().required('Please enter the commission').min(0, 'Commission is invalid'),
                })}
              >
                <Form size='large'>
                  <Select
                    id='transactionTypeName'
                    name='transactionTypeName'
                    label='Transaction Type'
                    options={transactionTypesList}
                    placeholder='Select a transaction type'
                    selection
                    errorPrompt
                  />
                  <FormDatePicker />
                  <Input id='symbol' fluid name='symbol' label='Symbol' placeholder='Security symbol' errorPrompt />
                  <Input id='shares' fluid name='shares' label='Shares' placeholder='Number of shares' errorPrompt />
                  <Input id='price' fluid name='price' label='Price' placeholder='Price per share' errorPrompt />
                  <Input
                    id='commision'
                    fluid
                    name='commission'
                    label='Commission'
                    placeholder='Commission of trade'
                    errorPrompt
                  />
                  <SubmitButton fluid primary>
                    Submit
                  </SubmitButton>
                </Form>
              </Formik>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    </>
  );
};

export default TransactionForm;
