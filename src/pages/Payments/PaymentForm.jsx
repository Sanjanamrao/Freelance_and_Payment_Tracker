
import React, { useState } from 'react';
import { TextField, Grid, Paper, Button, Typography, MenuItem } from '@mui/material';
import { createPayment } from '../../services/payments';
import { useToast } from '../../context/ToastContext.jsx';

const modes = ['UPI', 'Bank Transfer', 'Cash', 'Card', 'PayPal', 'Stripe'];

export default function PaymentForm() {
  const [form, setForm] = useState({ InvoiceID: '', AmountPaid: '', PaymentDate: '', Mode: '' });
  const { notify } = useToast();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () =>
    createPayment(form)
      .then(() => notify('Payment recorded', 'success'))
      .catch(() => notify('Create failed', 'error'));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>New Payment</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Invoice ID" name="InvoiceID" fullWidth value={form.InvoiceID} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={6}><TextField label="Amount Paid" name="AmountPaid" fullWidth value={form.AmountPaid} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={6}><TextField label="Payment Date" name="PaymentDate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.PaymentDate} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={6}>
          <TextField select label="Mode" name="Mode" fullWidth value={form.Mode} onChange={handleChange}>
            {modes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>Create</Button>
    </Paper>
  );
}

