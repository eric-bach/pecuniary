'use server';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { Account, Aggregates } from '@/../../../infrastructure/graphql/api/codegen/appsync';
import { createAccount, deleteAccount } from '@/../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { ZodIssue, z } from 'zod';

interface Props {
  name: string;
  type: string;
}

const schema = z.object({
  name: z.string().min(1, 'Name cannot be blank'),
  type: z.string().refine((value: string) => value === 'TFSA' || value === 'RRSP', 'Type must be either TFSA or RRSP'),
});

export async function createNewAccount({ name, type }: Props): Promise<Account | ZodIssue[]> {
  const validation = schema.safeParse({
    name,
    type,
  });

  if (!validation.success) {
    return validation.error.issues;
  }

  const { data } = await cookieBasedClient.graphql({
    query: createAccount,
    variables: {
      input: {
        name,
        type,
      },
    },
  });

  revalidatePath('/accounts/manage');

  return data.createAccount;
}

export async function deleteExistingAccount(accountId: String): Promise<Aggregates> {
  const { data } = await cookieBasedClient.graphql({
    query: deleteAccount,
    variables: {
      accountId,
    },
  });

  revalidatePath('/accounts/manage');

  return data.deleteAccount;
}
