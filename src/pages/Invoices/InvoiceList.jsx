// src/pages/Invoices/InvoicesList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { getPayments } from '../../services/payments';
import PaymentFormDialog from '../../components/PaymentFormDialog';

export default function InvoicesList() {
  const [payments, setPayments] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => { fetchPayments(); }, []);

  async function fetchPayments() {
    const data = await getPayments();
    setPayments(data);
  }

  return (
    <Box>
      <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Payments</Typography>
        <Button variant="contained" onClick={() => { setSelectedInvoice(1); setOpenAdd(true); }}>
          Record Payment
        </Button>
      </Grid>

      <Grid container spacing={3}>
        {payments.map(p => (
          <Grid item xs={12} md={4} key={p.PaymentID}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Invoice #{p.InvoiceID}</Typography>
              <Typography variant="caption">Amount Paid: ₹{p.AmountPaid}</Typography>
              <Typography variant="caption">Date: {p.PaymentDate}</Typography>
              <Typography variant="caption">Mode: {p.Mode}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <PaymentFormDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={fetchPayments}
        invoiceId={selectedInvoice}
      />
    </Box>
  );
}
