
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Grid, TextField } from '@mui/material';
import DataTable from '../../components/DataTable.jsx';
import { getPayments, deletePayment } from '../../services/payments';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

export default function PaymentList({ onShowAdd }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const { notify } = useToast();
  const [q, setQ] = useState('');

  const load = () => {
    setLoading(true);
    getPayments().then(res => setRows(res.data)).catch(() => notify('Failed to load payments', 'error')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => !q || (r.project || r.ProjectID || '').toString().toLowerCase().includes(q.toLowerCase()));

  const columns = [
    { field: 'PaymentID', headerName: 'ID' },
    { field: 'InvoiceID', headerName: 'Invoice' },
    { field: 'AmountPaid', headerName: 'Amount Paid' },
    { field: 'PaymentDate', headerName: 'Payment Date' },
    { field: 'Mode', headerName: 'Mode' },
  ];

  return (
    <Box>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item><Typography variant="h6">Payments</Typography></Grid>
        <Grid item><Button variant="contained" onClick={onShowAdd}>Record Payment</Button></Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField size="small" placeholder="Search payments..." value={q} onChange={e => setQ(e.target.value)} />
      </Paper>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        emptyLabel="No payments"
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete payment"
        content="Are you sure you want to delete this payment?"
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={() => {
          deletePayment(confirm.id).then(() => { notify('Payment deleted', 'success'); load(); }).catch(() => notify('Delete failed', 'error')).finally(() => setConfirm({ open: false, id: null }));
        }}
      />
    </Box>
  );
}
