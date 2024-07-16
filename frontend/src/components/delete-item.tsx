'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeleteItemProps {
  dialogTitle: string;
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const DeleteItem = ({ isOpen, handleClose, handleConfirm, dialogTitle }: DeleteItemProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {/* <DialogDescription>To confirm deletion, enter &quot;delete&quot; below</DialogDescription> */}
        </DialogHeader>
        {/* <Input type='text' value={deleteConfirm} onChange={handleInputChange} placeholder='Enter "delete" to confirm' /> */}
        <DialogFooter className='pt-2'>
          <Button onClick={handleClose} variant='outline'>
            Cancel
          </Button>
          {/* <Button onClick={handleConfirm} disabled={deleteConfirm !== 'delete'}> */}
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItem;
