

// src/pages/Projects/ProjectList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Grid, TextField, IconButton } from '@mui/material';
import { getProjects, deleteProject } from '../../services/projects';
import { useToast } from '../../context/ToastContext.jsx';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProjectList({ onShowAdd }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const { notify } = useToast();
  const [q, setQ] = useState('');

  const load = () => {
    setLoading(true);
    getProjects()
      .then(res => setRows(res.data))
      .catch(() => notify('Failed to load projects', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => !q || (r.Title || r.title || '').toLowerCase().includes(q.toLowerCase()));

  const columns = [
    { field: 'ProjectID', headerName: 'ID' },
    { field: 'Title', headerName: 'Project' },
    { field: 'Description', headerName: 'Description' },
    { field: 'StartDate', headerName: 'Start' },
    { field: 'EndDate', headerName: 'End' },
    {
      field: 'actions', headerName: 'Actions', render: (_, row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small"><VisibilityIcon /></IconButton>
          <IconButton size="small" color="primary"><EditIcon /></IconButton>
          <IconButton size="small" color="error" onClick={() => setConfirm({ open: true, id: row.ProjectID })}><DeleteIcon /></IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item><Typography variant="h6">Projects</Typography></Grid>
        <Grid item>
          <Button variant="contained" onClick={onShowAdd}>New Project</Button>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField size="small" placeholder="Search projects..." value={q} onChange={e => setQ(e.target.value)} />
          <Button variant="outlined">Filter</Button>
        </Box>
      </Paper>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        page={page}
        rowsPerPage={rpp}
        onPageChange={setPage}
        onRowsPerPageChange={setRpp}
        emptyLabel="No projects"
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete project"
        content="Are you sure you want to delete this project?"
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={() => {
          deleteProject(confirm.id)
            .then(() => { notify('Project deleted', 'success'); load(); })
            .catch(() => notify('Delete failed', 'error'))
            .finally(() => setConfirm({ open: false, id: null }));
        }}
      />
    </Box>
  );
}
