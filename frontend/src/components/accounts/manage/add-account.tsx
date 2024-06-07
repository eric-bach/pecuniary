import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { FormEvent } from 'react';
import { create } from './create-account';

export const AddAccount = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const result = await create({ name: formData.get('name')?.toString() || '', type: formData.get('type')?.toString() || '' });

    if (result) {
      onClose();
    }
  }

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
                <Input name='name' label='Name' variant='bordered' />
                <Input name='type' label='Type' variant='bordered' />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onClick={onClose}>
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
