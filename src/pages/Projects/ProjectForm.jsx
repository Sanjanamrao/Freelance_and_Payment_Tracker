// // src/pages/Projects/ProjectForm.jsx
import React, { useState } from 'react';
import { TextField, Grid, Paper, Button, Typography } from '@mui/material';
import { createProject } from '../../services/projects';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProjectForm() {
  const [form, setForm] = useState({ Title: '', Description: '', StartDate: '', EndDate: '', ClientID: '' });
  const { notify } = useToast();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () =>
    createProject(form)
      .then(() => notify('Project created', 'success'))
      .catch(() => notify('Create failed', 'error'));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>New Project</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Title" name="Title" fullWidth value={form.Title} onChange={handleChange} /></Grid>
        <Grid item xs={12}><TextField label="Description" name="Description" fullWidth multiline rows={3} value={form.Description} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={4}><TextField label="Start Date" name="StartDate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.StartDate} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={4}><TextField label="End Date" name="EndDate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={form.EndDate} onChange={handleChange} /></Grid>
        <Grid item xs={12} md={4}><TextField label="Client ID" name="ClientID" fullWidth value={form.ClientID} onChange={handleChange} /></Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>Create</Button>
    </Paper>
  );
}
