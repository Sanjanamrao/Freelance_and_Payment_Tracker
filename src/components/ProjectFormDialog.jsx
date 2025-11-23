// src/components/ProjectFormDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { createProject } from '../services/projects';
import { getClients } from '../services/clients'; // <-- you’ll need a service to fetch clients

export default function ProjectFormDialog({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    clientId: '',
    status: 'Pending',
  });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await getClients(); // returns [{id, name, email}, ...]
        setClients(data);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    }
    if (open) fetchClients();
  }, [open]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await createProject(form); // calls add_project stored procedure
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          fullWidth
          margin="normal"
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          fullWidth
          margin="normal"
          value={form.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          fullWidth
          margin="normal"
          value={form.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Budget"
          name="budget"
          type="number"
          fullWidth
          margin="normal"
          value={form.budget}
          onChange={handleChange}
        />

        {/* Client dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="client-label">Client</InputLabel>
          <Select
            labelId="client-label"
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
          >
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name} ({client.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
