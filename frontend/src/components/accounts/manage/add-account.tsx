import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React from 'react';

export const AddAccount = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const createAccount = () => {
    console.log('Created Account');
  };

  return (
    <div>
      <>
        <Button onPress={onOpen} color='primary'>
          Add Account
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Add Account</ModalHeader>
                <ModalBody>
                  <Input label='Name' variant='bordered' />
                  <Input label='Type' variant='bordered' />
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='flat' onClick={onClose}>
                    Close
                  </Button>
                  <Button color='primary' onPress={createAccount}>
                    Add Account
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};
