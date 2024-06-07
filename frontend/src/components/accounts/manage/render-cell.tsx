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
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();

  // @ts-ignore
  const cellValue = data.account[data.columnKey];

  async function onEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('Edit');

    deleteModal.onClose();
  }

  async function onDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await deleteExistingAccount(data.account.accountId);

    deleteModal.onClose();
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
              <Button isIconOnly variant='light' size='sm' onClick={() => console.log('View account', data.account.accountId)}>
                <EyeIcon size={20} fill='#979797' />
              </Button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content='Edit account' color='secondary'>
              <Button isIconOnly variant='light' size='sm' onClick={editModal.onOpen}>
                <EditIcon size={20} fill='#979797' />
                <Modal isOpen={editModal.isOpen} onOpenChange={editModal.onOpenChange} placement='top-center'>
                  <ModalContent>
                    {(onClose) => (
                      <form onSubmit={onEditSubmit}>
                        <ModalHeader className='flex flex-col gap-1'>Edit account &quot;{data.account.name}&quot;?</ModalHeader>
                        <ModalBody>Edit</ModalBody>
                        <ModalFooter>
                          <Button color='default' variant='flat' onClick={onClose}>
                            Cancel
                          </Button>
                          <Button type='submit' color='primary'>
                            Edit
                          </Button>
                        </ModalFooter>
                      </form>
                    )}
                  </ModalContent>
                </Modal>
              </Button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content='Delete account' color='danger'>
              <Button isIconOnly variant='light' size='sm' onClick={deleteModal.onOpen}>
                <DeleteIcon size={20} fill='#FF0080' />
                <Modal isOpen={deleteModal.isOpen} onOpenChange={deleteModal.onOpenChange} placement='top-center'>
                  <ModalContent>
                    {(onClose) => (
                      <form onSubmit={onDeleteSubmit}>
                        <ModalHeader className='flex flex-col gap-1'>Delete account &quot;{data.account.name}&quot;?</ModalHeader>
                        <ModalBody>
                          To confirm deletion, enter &apos;delete&apos; below
                          <Input type='text' name='confirm' onChange={(e) => handleChange(e)} placeholder='Enter "delete" to confirm' />
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
              </Button>
            </Tooltip>
          </div>
        </div>
      );
    default:
      return cellValue;
  }
};
