import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React from 'react';

export const AddAccount = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                  <Input label='Email' variant='bordered' />
                  <Input label='First Name' variant='bordered' />
                  <Input label='Last Name' variant='bordered' />
                  <Input label='Phone Number' variant='bordered' />

                  <Input label='Password' type='password' variant='bordered' />
                  <Input label='Confirm Password' type='password' variant='bordered' />
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='flat' onClick={onClose}>
                    Close
                  </Button>
                  <Button color='primary' onPress={onClose}>
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
