// src/components/PaymentFormDialog.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { createPayment } from '../services/payments';

export default function PaymentFormDialog({ open, onClose, onSuccess, invoiceId }) {
  const [form, setForm] = useState({ amount: '', mode: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await createPayment({ invoiceId, amount: form.amount, mode: form.mode }); // calls record_payment stored procedure
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error recording payment:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Record Payment</DialogTitle>
      <DialogContent>
        <TextField label="Amount" name="amount" type="number" fullWidth margin="normal" value={form.amount} onChange={handleChange} />
        <TextField label="Mode" name="mode" fullWidth margin="normal" value={form.mode} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
