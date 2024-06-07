import {
  User,
  Tooltip,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Button,
  Input,
} from '@nextui-org/react';
import React, { FormEvent, useState } from 'react';
import { DeleteIcon } from '@/components/icons/table/delete-icon';
import { EditIcon } from '@/components/icons/table/edit-icon';
import { EyeIcon } from '@/components/icons/table/eye-icon';
import { Account } from '@/../../../infrastructure/graphql/api/codegen/appsync';
import { deleteExistingAccount } from './actions';

interface Props {
  account: Account;
  columnKey: string | React.Key;
}

export const RenderCell = (data: Props) => {
  const [confirm, setConfirm] = useState<string | undefined>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // @ts-ignore
  const cellValue = data.account[data.columnKey];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await deleteExistingAccount(data.account.accountId);

    onClose();
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(event.target.value);
  };

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
            <Tooltip content='Delete account' color='danger'>
              <button onClick={onOpen}>
                <DeleteIcon size={20} fill='#FF0080' />
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
                  <ModalContent>
                    {(onClose) => (
                      <form onSubmit={onSubmit}>
                        <ModalHeader className='flex flex-col gap-1'>Delete Account</ModalHeader>
                        <ModalBody>
                          Are you sure you want to delete this account?
                          <Input type='text' name='confirm' onChange={(e) => handleChange(e)} placeholder='Type "delete" to confirm' />
                        </ModalBody>
                        <ModalFooter>
                          <Button color='default' variant='flat' onClick={onClose}>
                            Cancel
                          </Button>
                          <Button type='submit' color='danger' isDisabled={confirm !== 'delete'}>
                            Delete
                          </Button>
                        </ModalFooter>
                      </form>
                    )}
                  </ModalContent>
                </Modal>
              </button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
