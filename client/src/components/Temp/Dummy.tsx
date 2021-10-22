import React, { useState, useEffect } from 'react';
import { gql, useSubscription } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

const initialState = { name: '', description: '' };

const Dummy = () => {
  const LIST_EVENTS = gql`
    query listEvents {
      listEvents {
        items {
          id
          name
        }
      }
    }
  `;

  const { loading: listLoading, data: listData, error: listError } = useQuery(LIST_EVENTS);

  console.log('LIST_EVENTS: ', listData);

  // const CREATE_TODO = gql`
  //   mutation createTodo($input: CreateTodoInput!) {
  //     createTodo(input: $input) {
  //       id
  //       name
  //       description
  //     }
  //   }
  // `;

  //   // https://www.apollographql.com/docs/react/data/mutations/
  //   const [addTodoMutateFunction, { error: createError }] =
  //     useMutation(CREATE_TODO);

  //   async function addTodo() {
  //     try {
  //       addTodoMutateFunction({ variables: { input: { todo  } } });
  //     } catch (err) {
  //       console.log("error creating todo:", err);
  //     }
  //   }

  //   const DELETE_TODO = gql`
  //     mutation deleteTodo($input: DeleteTodoInput!) {
  //       deleteTodo(input: $input) {
  //         id
  //         name
  //         description
  //       }
  //     }
  //   `;

  //   const [deleteTodoMutateFunction] = useMutation(DELETE_TODO, {
  //     refetchQueries: [LIST_EVENTS, "listEvents"],
  //   });

  //   async function removeTodo(id : any) {
  //     try {
  //       deleteTodoMutateFunction({ variables: { input: { id } } });
  //     } catch (err) {
  //       console.log("error deleting todo:", err);
  //     }
  //   }

  //   const CREATE_TODO_SUBSCRIPTION = gql`
  //     subscription OnCreateTodo {
  //       onCreateTodo {
  //         id
  //         name
  //         description
  //       }
  //     }
  //   `;

  //   const { data: createSubData, error: createSubError } = useSubscription(
  //     CREATE_TODO_SUBSCRIPTION
  //   );

  return <div>This page will create an Account and test that the createEvent subscription is triggered</div>;
};

export default Dummy;
