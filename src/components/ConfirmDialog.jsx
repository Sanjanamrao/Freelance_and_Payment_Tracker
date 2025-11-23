
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDialog({ open, title = 'Confirm', content, onClose, onConfirm, confirmLabel = 'Confirm' }) {
  return (
    <Dialog open={open} onClose={() => onClose?.()}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.()} variant="text">Cancel</Button>
        <Button onClick={() => onConfirm?.()} variant="contained" color="error">{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
