import { User, Tooltip, Chip } from '@nextui-org/react';
import React from 'react';
import { DeleteIcon } from '@/components/icons/table/delete-icon';
import { EditIcon } from '@/components/icons/table/edit-icon';
import { EyeIcon } from '@/components/icons/table/eye-icon';
import { Account } from '../../../../../infrastructure/graphql/api/codegen/appsync';

interface Props {
  account: Account;
  columnKey: string | React.Key;
}

export const RenderCell = (data: Props) => {
  // @ts-ignore
  const cellValue = data.account[data.columnKey];

  switch (data.columnKey) {
    case 'name':
      return (
        <User
          avatarProps={{
            src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
          }}
          name={cellValue}
        >
          {data.account.name}
        </User>
      );
    case 'type':
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span>{data.account.entity}</span>
          </div>
        </div>
      );
    case 'createdAt':
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
        </div>
      );
    case 'status':
      return (
        // <Chip size='sm' variant='flat' color={cellValue === 'active' ? 'success' : cellValue === 'paused' ? 'danger' : 'warning'}>
        <Chip size='sm' variant='flat' color='success'>
          <span className='capitalize text-xs'>Active</span>
        </Chip>
      );
    case 'actions':
      return (
        <div className='flex items-center gap-4'>
          <div>
            <Tooltip content='Details'>
              <button onClick={() => console.log('View account', data.account.accountId)}>
                <EyeIcon size={20} fill='#979797' />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content='Edit account' color='secondary'>
              <button onClick={() => console.log('Edit account', data.account.accountId)}>
                <EditIcon size={20} fill='#979797' />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content='Delete account' color='danger' onClick={() => console.log('Delete account', data.account.accountId)}>
              <button>
                <DeleteIcon size={20} fill='#FF0080' />
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
