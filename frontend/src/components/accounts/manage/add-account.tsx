import React from 'react';
import { useFormState } from 'react-dom';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import * as actions from '@/actions/index';

export const AddAccount = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [formState, action] = useFormState(actions.createNewAccount, { errors: {} });

  function handleClose() {
    formState.errors = {};
    onClose();
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

  return (
    <div>
      <Button onPress={onOpen} color='primary'>
        Add Account
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {(onClose) => (
            <form action={action}>
              <ModalHeader className='flex flex-col gap-1'>Add Account</ModalHeader>
              <ModalBody>
                <Input
                  name='name'
                  label='Name'
                  variant='bordered'
                  placeholder='Enter account name'
                  isInvalid={!!formState.errors.name}
                  errorMessage={formState.errors.name?.join(', ')}
                />
                <Select
                  name='category'
                  items={categories}
                  label='Account Category'
                  placeholder='Select an account category'
                  isInvalid={!!formState.errors.category}
                  errorMessage={formState.errors.category?.join(', ')}
                  variant='bordered'
                  className='border-gray-300 rounded-md mt-2'
                >
                  {(categories) => <SelectItem key={categories.label}>{categories.label}</SelectItem>}
                </Select>
                <Select
                  name='type'
                  items={types}
                  label='Account Type'
                  placeholder='Select an account type'
                  isInvalid={!!formState.errors.type}
                  errorMessage={formState.errors.type?.join(', ')}
                  variant='bordered'
                  className='border-gray-300 rounded-md mt-2'
                >
                  {(types) => <SelectItem key={types.label}>{types.label}</SelectItem>}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onClick={handleClose}>
                  Close
                </Button>
                <Button type='submit' color='primary'>
                  Add Account
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
