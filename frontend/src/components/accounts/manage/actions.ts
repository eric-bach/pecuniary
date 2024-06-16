'use server';
import { cookieBasedClient } from '@/utils/amplifyServerUtils';
import { Account } from '@/../../../infrastructure/graphql/api/codegen/appsync';
import { getAccount } from '@/../../../infrastructure/graphql/api/queries';
import { updateAccount } from '@/../../../infrastructure/graphql/api/mutations';
import { revalidatePath } from 'next/cache';
import { ZodIssue, z } from 'zod';

interface Props {
  name: string;
  category: string;
  type: string;
}

interface Props2 {
  pk: string;
  createdAt: string;
}

const schema = z.object({
  name: z.string().min(1, 'Name cannot be blank'),
  category: z
    .string()
    .refine(
      (value: string) => value === 'Banking' || value === 'Credit Card' || value === 'Investment' || value === 'Asset',
      'Category is not a valid type'
    ),
  type: z.string().refine((value: string) => value === 'TFSA' || value === 'RRSP', 'Type must be either TFSA or RRSP'),
});

export async function getExistingAccount(accountId: string): Promise<Account> {
  const { data } = await cookieBasedClient.graphql({
    query: getAccount,
    variables: {
      accountId,
    },
  });

  return data.getAccount;
}

export async function updateExistingAccount({ pk, createdAt, name, category, type }: Props & Props2): Promise<Account | ZodIssue[]> {
  const validation = schema.safeParse({
    name,
    category,
    type,
  });

  if (!validation.success) {
    return validation.error.issues;
  }

  const { data } = await cookieBasedClient.graphql({
    query: updateAccount,
    variables: {
      input: {
        pk,
        createdAt,
        name,
        category,
        type,
      },
    },
  });

  revalidatePath('/accounts/manage');

  return data.updateAccount;
}
