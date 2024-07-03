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
  Select,
  SelectItem,
} from '@nextui-org/react';
import React, { useState } from 'react';
import { DeleteIcon } from '@/components/icons/table/delete-icon';
import { EditIcon } from '@/components/icons/table/edit-icon';
import { EyeIcon } from '@/components/icons/table/eye-icon';
import { Account } from '@/../../../infrastructure/graphql/api/codegen/appsync';
import { useFormState } from 'react-dom';
import * as actions from '@/actions';

interface Props {
  account: Account;
  columnKey: string | React.Key;
}

const types = [
  { label: 'TFSA', value: 'TFSA' },
  { label: 'RRSP', value: 'RRSP' },
];

const categories = [
  { label: 'Banking', value: 'Banking' },
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'Investment', value: 'Investment' },
  { label: 'Asset', value: 'Asset' },
];

export const RenderCell = (data: Props) => {
  const [confirm, setConfirm] = useState<string | undefined>();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [editFormState, editAction] = useFormState(actions.editExistingAccount, { errors: {} });
  const [deleteFormState, deleteAction] = useFormState(actions.deleteExistingAccount, { errors: {} });

  // @ts-ignore
  const cellValue = data.account[data.columnKey];

  const handleDeleteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    case 'category':
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
        </div>
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
                      <form action={editAction}>
                        <ModalHeader className='flex flex-col gap-1'>Edit account &quot;{data.account.name}&quot;?</ModalHeader>
                        <ModalBody>
                          <Input
                            label='Name'
                            name='name'
                            defaultValue={data.account.name}
                            variant='bordered'
                            isInvalid={!!editFormState.errors.name}
                            errorMessage={editFormState.errors.name?.join(', ')}
                          />
                          <Select
                            label='Account Category'
                            name='category'
                            items={categories}
                            defaultSelectedKeys={[data.account.category]}
                            placeholder='Select an account category'
                            isInvalid={!!editFormState.errors.category}
                            errorMessage={editFormState.errors.category?.join(', ')}
                            variant='bordered'
                            className='border-gray-300 rounded-md mt-2'
                          >
                            {(categories) => <SelectItem key={categories.label}>{categories.label}</SelectItem>}
                          </Select>
                          <Select
                            name='type'
                            label='Account Type'
                            items={types}
                            defaultSelectedKeys={[data.account.type]}
                            placeholder='Select an account type'
                            isInvalid={!!editFormState.errors.type}
                            errorMessage={editFormState.errors.type?.join(', ')}
                            variant='bordered'
                            className='border-gray-300 rounded-md mt-2'
                          >
                            {(AccountTypes) => <SelectItem key={AccountTypes.label}>{AccountTypes.label}</SelectItem>}
                          </Select>
                          <input type='hidden' name='accountId' value={data.account.accountId} />
                          <input type='hidden' name='createdAt' value={data.account.createdAt} />
                        </ModalBody>
                        <ModalFooter>
                          <Button color='default' variant='flat' onClick={editModal.onClose}>
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
                      <form action={deleteAction}>
                        <ModalHeader className='flex flex-col gap-1'>Delete account &quot;{data.account.name}&quot;?</ModalHeader>
                        <ModalBody>
                          To confirm deletion, enter &apos;delete&apos; below
                          <Input
                            type='text'
                            name='confirm'
                            onChange={(e) => handleDeleteChange(e)}
                            placeholder='Enter "delete" to confirm'
                          />
                          <input type='hidden' name='accountId' value={data.account.accountId} />
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
