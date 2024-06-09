import React, { FormEvent, useState } from 'react';
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
import { createNewAccount } from './actions';
import { ZodIssue } from 'zod';

export const AddAccount = () => {
  const [error, setError] = useState<ZodIssue[]>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [formData, setFormData] = useState({ name: '', type: '' });

  function handleClose() {
    setError(undefined);
    onClose();
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setError(undefined);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name')?.toString() ?? '';
    const type = formData.get('type')?.toString() ?? '';

    const result = await createNewAccount({ name, type });

    console.log(result);

    if (result instanceof Array) {
      setError(result);
    } else if (result) {
      handleClose();
    }
  }

  const types = [
    { label: 'TFSA', value: 'TFSA' },
    { label: 'RRSP', value: 'RRSP' },
  ];

  return (
    <div>
      <Button onPress={onOpen} color='primary'>
        Add Account
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className='flex flex-col gap-1'>Add Account</ModalHeader>
              <ModalBody>
                <Input
                  name='name'
                  label='Name'
                  variant='bordered'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Enter account name'
                  isInvalid={error?.find((e) => e.path[0] === 'name')?.message !== undefined}
                  errorMessage={error?.find((e) => e.path[0] === 'name')?.message}
                />
                <Select
                  name='type'
                  items={types}
                  label='Account Type'
                  value={formData.type}
                  onChange={handleChange}
                  placeholder='Select an account type'
                  isInvalid={error?.find((e) => e.path[0] === 'type')?.message !== undefined}
                  errorMessage={error?.find((e) => e.path[0] === 'type')?.message}
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
