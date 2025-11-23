
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Grid, TextField } from '@mui/material';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { getInvoices, deleteInvoice } from '../../services/invoices';
import { useToast } from '../../context/ToastContext.jsx';

export default function InvoiceList({ onShowAdd }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [q, setQ] = useState('');
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    getInvoices().then(res => setRows(res.data)).catch(() => notify('Failed to load invoices', 'error')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => !q || String(r.InvoiceID).includes(q) || (r.ProjectID && String(r.ProjectID).includes(q)));

  const columns = [
    { field: 'InvoiceID', headerName: 'ID' },
    { field: 'ProjectID', headerName: 'Project' },
    { field: 'Amount', headerName: 'Amount' },
    { field: 'IssueDate', headerName: 'Issue Date' },
    { field: 'DueDate', headerName: 'Due Date' },
  ];

  return (
    <Box>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item><Typography variant="h6">Invoices</Typography></Grid>
        <Grid item><Button variant="contained" onClick={onShowAdd}>New Invoice</Button></Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField size="small" placeholder="Search invoices..." value={q} onChange={e => setQ(e.target.value)} />
      </Paper>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        page={0}
        rowsPerPage={10}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        emptyLabel="No invoices"
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete invoice"
        content="Are you sure you want to delete this invoice?"
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={() => {
          deleteInvoice(confirm.id).then(() => { notify('Invoice deleted', 'success'); load(); }).catch(() => notify('Delete failed', 'error')).finally(() => setConfirm({ open: false, id: null }));
        }}
      />
    </Box>
  );
}
