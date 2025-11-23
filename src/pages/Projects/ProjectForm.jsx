// src/pages/Projects/ProjectForm.jsx
import React, { useState } from 'react';
import { TextField, Grid, Paper, Button, Typography, MenuItem } from '@mui/material';
import { createProject } from '../../services/projects';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProjectForm() {
  const [form, setForm] = useState({
    Title: '',
    Description: '',
    StartDate: '',
    EndDate: '',
    ClientID: '',
    budget: '',
    Status: 'Pending'   // NEW FIELD
  });

  const { notify } = useToast();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () => {
    const payload = {
      title: form.Title,
      description: form.Description,
      startDate: form.StartDate,
      endDate: form.EndDate,
      clientId: form.ClientID,
      budget: form.budget
      // ❗ Status is NOT sent to Supabase because add_project() does not accept it
    };

    createProject(payload)
      .then(() => notify('Project created', 'success'))
      .catch(() => notify('Create failed', 'error'));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>New Project</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Title"
            name="Title"
            fullWidth
            value={form.Title}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            name="Description"
            fullWidth
            multiline
            rows={3}
            value={form.Description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Start Date"
            name="StartDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.StartDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="End Date"
            name="EndDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.EndDate}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Client ID"
            name="ClientID"
            fullWidth
            value={form.ClientID}
            onChange={handleChange}
          />
        </Grid>

        {/* NEW Budget Field */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Budget"
            name="budget"
            fullWidth
            value={form.budget}
            onChange={handleChange}
          />
        </Grid>

        {/* NEW Status Dropdown */}
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Status"
            name="Status"
            fullWidth
            value={form.Status}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>
        Create
      </Button>
    </Paper>
  );
}
