import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField } from '@mui/material';
import { getClients } from '../../services/clients';
import { useToast } from '../../context/ToastContext.jsx';
import ClientFormDialog from '../../components/ClientFormDialog';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const { notify } = useToast();
  const [q, setQ] = useState('');
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const data = await getClients();
      setClients(data);
    } catch {
      notify('Failed to load clients', 'error');
    }
  }

  const filtered = clients.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Box>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Grid item><Typography variant="h6">Clients</Typography></Grid>
        <Grid item><Button variant="contained" onClick={() => setOpenAdd(true)}>Add Client</Button></Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search clients..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </Paper>

      <Grid container spacing={3}>
        {(filtered.length ? filtered : []).map(client => (
          <Grid item xs={12} md={4} key={client.id}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'primary.main', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {client.name?.charAt(0)}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1">{client.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{client.email}</Typography>
                  </Box>
                </Box>
                <Button variant="outlined" size="small">View</Button>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Projects</Typography>
                  <Typography variant="h6">{client.projects}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Paid</Typography>
                  <Typography variant="h6" color="success.main">₹ {Number(client.totalPaid || 0).toLocaleString()}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Add Client Dialog */}
      <ClientFormDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={fetchClients}
      />
    </Box>
  );
}
