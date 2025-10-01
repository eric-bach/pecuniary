import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateClient } from 'aws-amplify/api';
import { getAccounts, updateAccount, deleteAccount, createAccount } from '@/actions/api/queries';
import type { Account } from '@/types/account';

const client = generateClient();

// Types for mutations
interface UpdateAccountInput {
  accountId: string;
  name: string;
  type: string;
  category: string;
}

interface CreateAccountInput {
  name: string;
  type: string;
  category: string;
}

// Hook to fetch all accounts
export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await client.graphql({
        query: getAccounts,
        variables: {},
      });

      if ('data' in response && response.data?.getAccounts?.items) {
        return response.data.getAccounts.items as Account[];
      }
      return [];
    },
  });
}

// Hook to update an account
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateAccountInput) => {
      const response = await client.graphql({
        query: updateAccount,
        variables: { input },
      });

      if ('data' in response && response.data?.updateAccount) {
        return response.data.updateAccount as Account;
      }
      throw new Error('Failed to update account');
    },
    onSuccess: () => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

// Hook to delete an account
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const response = await client.graphql({
        query: deleteAccount,
        variables: { accountId },
      });

      if ('data' in response && response.data?.deleteAccount) {
        return response.data.deleteAccount;
      }
      throw new Error('Failed to delete account');
    },
    onSuccess: () => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

// Hook to create an account
export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAccountInput) => {
      const response = await client.graphql({
        query: createAccount,
        variables: { input },
      });

      if ('data' in response && response.data?.createAccount) {
        return response.data.createAccount as Account;
      }
      throw new Error('Failed to create account');
    },
    onSuccess: () => {
      // Invalidate and refetch accounts
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
