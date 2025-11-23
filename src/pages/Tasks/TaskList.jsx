// // src/pages/Tasks/TaskList.jsx
import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../../services/tasks';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function TaskList({ onShowAdd }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const { notify } = useToast();
  const [q, setQ] = useState('');

  const load = () => {
    setLoading(true);
    getTasks().then(res => setRows(res.data)).catch(() => notify('Failed to load tasks', 'error')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => !q || (r.Title || '').toLowerCase().includes(q.toLowerCase()));

  const columns = [
    { field: 'TaskID', headerName: 'ID' },
    { field: 'ProjectID', headerName: 'Project' },
    { field: 'Title', headerName: 'Title' },
    { field: 'Status', headerName: 'Status', render: (val) => val },
    { field: 'Deadline', headerName: 'Deadline' }
  ];

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item><Typography variant="h6">Tasks</Typography></Grid>
        <Grid item><Button variant="contained" onClick={onShowAdd}>New Task</Button></Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}><TextField size="small" placeholder="Search tasks..." value={q} onChange={e => setQ(e.target.value)} /></Paper>

      <DataTable columns={columns} rows={filtered} loading={loading} page={0} rowsPerPage={10} onPageChange={() => {}} onRowsPerPageChange={() => {}} emptyLabel="No tasks" />

      <ConfirmDialog open={confirm.open} title="Delete task" content="Are you sure?" onClose={() => setConfirm({ open: false, id: null })} onConfirm={() => {
        deleteTask(confirm.id).then(() => { notify('Task deleted', 'success'); load(); }).catch(() => notify('Delete failed', 'error')).finally(() => setConfirm({ open: false, id: null }));
      }} />
    </div>
  );
}
