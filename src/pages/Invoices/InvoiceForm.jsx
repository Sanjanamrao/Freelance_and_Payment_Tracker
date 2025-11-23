
import React, { useState } from 'react';
import { TextField, Grid, Paper, Button, Typography } from '@mui/material';
import { createInvoice } from '../../services/invoices';
import { useToast } from '../../context/ToastContext.jsx';

export default function InvoiceForm() {
  const [form, setForm] = useState({ ProjectID: '', Amount: '', IssueDate: '', DueDate: '' });
  const { notify } = useToast();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () =>
    createInvoice(form)
      .then(() => notify('Invoice created', 'success'))
      .catch(() => notify('Create failed', 'error'));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>New Invoice</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Project ID" name="ProjectID" fullWidth value={form.ProjectID} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={6}><TextField label="Amount" name="Amount" fullWidth value={form.Amount} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={6}><TextField label="Issue Date" name="IssueDate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.IssueDate} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={6}><TextField label="Due Date" name="DueDate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.DueDate} onChange={handleChange} /></Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>Create</Button>
    </Paper>
  );
}
