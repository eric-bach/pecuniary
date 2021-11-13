import { useQuery, gql, useMutation } from '@apollo/client';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { Formik, Field } from 'formik';
import { Form, SubmitButton, Select, Input } from 'formik-semantic-ui-react';
import DatePicker from 'react-datepicker';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from '../Auth/User';
import Loading from '../../components/Loading';
import 'react-datepicker/dist/react-datepicker.css';
import { useContext, useEffect, useState } from 'react';

type SelectList = {
  key: string;
  text: string;
  value: string;
};

const LIST_TRANSACTION_TYPES = gql`
  query ListTransactionTypes {
    listTransactionTypes {
      id
      name
      description
    }
  }
`;

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($createTransactionInput: CreateEventInput!) {
    createEvent(event: $createTransactionInput) {
      id
      aggregateId
      name
      version
      data
      userId
      createdAt
    }
  }
`;

const FormDatePicker = (props: any) => {
  return (
    <Field name='transactionDate'>
      {({ field, meta, form: { setFieldValue } }: any) => {
        return (
          <>
            <div className='field'>
              <label>Transaction Date</label>
              <DatePicker
                {...field}
                placeholderText='Select transaction date'
                selected={field.value || null}
                onChange={(val: any) => {
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

const TransactionForm = (props: any) => {
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
    getSession().then((session: any) => {
      setUsername(session.idToken.payload.email);
    });
  }, [getSession]);

  if (transactionTypesError) return 'Error!'; // You probably want to do more here!
  if (transactionTypesLoading) return <Loading />;

  const transactionTypesList: SelectList[] = [];
  transactionTypes.listTransactionTypes.map((d: any) => {
    transactionTypesList.push({ key: d.id, text: d.name, value: d.description });
    return true;
  });

  const createTransaction = (values: any) => {
    console.log('[TRANSACTION FORM] Creating Transaction...');

    const account = props.location.state.account;
    const selectedTransactionType: SelectList = transactionTypesList.find(
      (a) => a.value === values.transactionType
    ) ?? {
      key: '',
      text: '',
      value: '',
    };

    // Convert transactionDate to AWSDate format
    const date = values.transactionDate.toISOString().substring(0, 10) + 'Z';

    const params = {
      createTransactionInput: {
        aggregateId: uuidv4(),
        name: 'TransactionCreatedEvent',
        data: `{ "accountId": "${account.id}", "transactionDate": "${date}", "shares": ${values.shares}, "price": ${values.price}, "commission": ${values.commission}, "symbol": "${values.symbol}", "transactionTypeId": ${selectedTransactionType.key} }`,
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
                  transactionType: '',
                  transactionDate: '',
                  symbol: '',
                  shares: '',
                  price: '',
                  commission: '',
                }}
                onSubmit={(values, actions) => {
                  console.log(values);
                  createTransaction(values);
                  actions.setSubmitting(false);
                }}
                validationSchema={Yup.object().shape({
                  transactionType: Yup.string().required('Please select a transaction type'),
                  transactionDate: Yup.string().required('Please enter a transaction date'),
                  symbol: Yup.string()
                    .required('Please enter a symbol')
                    .matches(/[A-Za-z]{2,4}[\S]*/, 'Stock symbol is invalid'),
                  shares: Yup.string()
                    .required('Please enter the number of shares')
                    .matches(/^[\d]+[.]*[\d]+$/, 'Number of shares is invalid'),
                  price: Yup.string()
                    .required('Please enter the share price')
                    .matches(/^\d+(\.\d{1,2})?$/, 'Price is invalid'),
                  commission: Yup.string()
                    .required('Please enter the commission')
                    .matches(/^\d+(\.\d{1,2})?$/, 'Commission is invalid'),
                })}
              >
                <Form size='large'>
                  <Select
                    id='transactionType'
                    name='transactionType'
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
