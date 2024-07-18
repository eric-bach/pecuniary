'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteItemProps {
  isOpen: boolean;
  disabled?: boolean;
  dialogTitle: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

const DeleteItem = ({ isOpen, disabled, dialogTitle, handleClose, handleConfirm }: DeleteItemProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {/* <DialogDescription>To confirm deletion, enter &quot;delete&quot; below</DialogDescription> */}
        </DialogHeader>
        {/* <Input type='text' value={deleteConfirm} onChange={handleInputChange} placeholder='Enter "delete" to confirm' /> */}
        <DialogFooter className='pt-2'>
          <Button onClick={handleClose} variant='outline' disabled={disabled}>
            Cancel
          </Button>
          {/* <Button onClick={handleConfirm} disabled={deleteConfirm !== 'delete'}> */}
          <Button onClick={handleConfirm} disabled={disabled}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItem;
