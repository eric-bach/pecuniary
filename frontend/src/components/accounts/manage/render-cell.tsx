import { User, Tooltip, Chip } from '@nextui-org/react';
import React from 'react';
import { DeleteIcon } from '@/components/icons/table/delete-icon';
import { EditIcon } from '@/components/icons/table/edit-icon';
import { EyeIcon } from '@/components/icons/table/eye-icon';
import { Account } from '../../../../../infrastructure/graphql/api/codegen/appsync';

interface Props {
  //account: (typeof Account)[number];
  account: any;
  columnKey: string | React.Key;
}

export const RenderCell = ({ account, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = user[columnKey];
  switch (columnKey) {
    case 'name':
      return (
        <User
          avatarProps={{
            src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
          }}
          name={cellValue}
        >
          {account.email}
        </User>
      );
    case 'role':
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span>{account.team}</span>
          </div>
        </div>
      );
    case 'status':
      return (
        <Chip size='sm' variant='flat' color={cellValue === 'active' ? 'success' : cellValue === 'paused' ? 'danger' : 'warning'}>
          <span className='capitalize text-xs'>{cellValue}</span>
        </Chip>
      );

    case 'actions':
      return (
        <div className='flex items-center gap-4 '>
          <div>
            <Tooltip content='Details'>
              <button onClick={() => console.log('View user', account.id)}>
                <EyeIcon size={20} fill='#979797' />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content='Edit user' color='secondary'>
              <button onClick={() => console.log('Edit user', account.id)}>
                <EditIcon size={20} fill='#979797' />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content='Delete user' color='danger' onClick={() => console.log('Delete user', account.id)}>
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
