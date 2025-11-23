

// src/pages/Projects/ProjectDetail.jsx
import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid, TextField, Button, Stack } from '@mui/material';
import { getProject, updateProject } from '../../services/projects';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProjectDetail({ id }) {
  const [project, setProject] = useState(null);
  const [editing, setEditing] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    if (!id) return;
    getProject(id)
  .then(res => setProject(res))
  .catch(() => notify('Failed to load project', 'error'));
  }, [id, notify]);

  const handleChange = e => setProject(p => ({ ...p, [e.target.name]: e.target.value }));

  const save = () =>
    updateProject(id, project)
      .then(() => { notify('Project updated', 'success'); setEditing(false); })
      .catch(() => notify('Update failed', 'error'));

  if (!project) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Project #{project.ProjectID}</Typography>
        <Button variant="outlined" onClick={() => setEditing(e => !e)}>{editing ? 'Cancel' : 'Edit'}</Button>
      </Stack>
      <Grid container spacing={2}>
        {['Title', 'Description', 'StartDate', 'EndDate', 'ClientID'].map((field) => (
          <Grid item xs={12} md={field === 'Description' ? 12 : 6} key={field}>
            <TextField
              label={field}
              name={field}
              value={project[field] ?? ''}
              onChange={handleChange}
              fullWidth
              multiline={field === 'Description'}
              rows={field === 'Description' ? 3 : 1}
              InputProps={{ readOnly: !editing }}
              InputLabelProps={field.includes('Date') ? { shrink: true } : undefined}
              type={field.includes('Date') ? 'date' : 'text'}
            />
          </Grid>
        ))}
      </Grid>
      {editing && <Button variant="contained" sx={{ mt: 2 }} onClick={save}>Save changes</Button>}
    </Paper>
  );
}
