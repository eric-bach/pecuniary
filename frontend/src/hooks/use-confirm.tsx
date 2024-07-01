import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {
  const [deleteConfirm, setDeleteConfirm] = useState<string>('');
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
    setDeleteConfirm('');
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const handleInputChange = (event: any) => {
    setDeleteConfirm(event.target.value);
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <Input type='text' value={deleteConfirm} onChange={handleInputChange} placeholder='Enter "delete" to confirm' />

        <DialogFooter className='pt-2'>
          <Button onClick={handleCancel} variant='outline'>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={deleteConfirm !== 'delete'}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
