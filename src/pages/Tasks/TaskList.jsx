import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { getTasksByProject } from '../../services/tasks';
import TaskFormDialog from '../../components/TaskFormDialog';

export default function TasksList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => { fetchTasks(); }, [projectId]);

  async function fetchTasks() {
    const data = await getTasksByProject(projectId);
    setTasks(data);
  }

  return (
    <Box>
      <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Tasks</Typography>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>Add Task</Button>
      </Grid>

      <Grid container spacing={3}>
        {tasks.map(t => (
          <Grid item xs={12} md={4} key={t.TaskID}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">{t.Title}</Typography>
              <Typography variant="caption">Status: {t.Status}</Typography>
              <Typography variant="caption">Deadline: {t.Deadline}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <TaskFormDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={fetchTasks}
        projectId={projectId}
      />
    </Box>
  );
}
