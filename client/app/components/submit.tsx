import { Button } from '@mui/material';
import { useIsSubmitting } from 'remix-validated-form';

export const SubmitButton = ({ submitText = 'Submit' }: { submitText?: string }) => {
  const isSubmitting = useIsSubmitting();

  return (
    <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : submitText}
    </Button>
  );
};
