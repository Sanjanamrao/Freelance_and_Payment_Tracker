// src/pages/Projects/ProjectsList.jsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { getProjects } from '../../services/projects';
import ProjectFormDialog from '../../components/ProjectFormDialog';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const data = await getProjects();
    setProjects(data);
  }

  return (
    <Box>
      <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Projects</Typography>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>Add Project</Button>
      </Grid>

      <Grid container spacing={3}>
        {projects.map(p => (
          <Grid item xs={12} md={4} key={p.ProjectID}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">{p.Title}</Typography>
              <Typography variant="caption">Status: {p.status}</Typography>
              <Typography variant="caption">Budget: ₹{p.budget}</Typography>
              <Typography variant="caption">Paid: ₹{p.total_paid}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <ProjectFormDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={fetchProjects}
      />
    </Box>
  );
}
