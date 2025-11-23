// src/pages/Tasks/TaskForm.jsx
import React, { useState } from "react";
import {
  TextField,
  Grid,
  Paper,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { createTask } from "../../services/tasks";
import { useToast } from "../../context/ToastContext.jsx";

const statuses = ["Pending", "In Progress", "Completed", "Overdue"];

export default function TaskForm() {
  const [form, setForm] = useState({
    ProjectID: "",
    Title: "",
    Status: "Pending",
    Deadline: "",
  });
  const { notify } = useToast();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = () =>
    createTask(form)
      .then(() => notify("Task created", "success"))
      .catch(() => notify("Create failed", "error"));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        New Task
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Project ID"
            name="ProjectID"
            fullWidth
            value={form.ProjectID}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Title"
            name="Title"
            fullWidth
            value={form.Title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Status"
            name="status"
            fullWidth
            value={form.status}
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="On Hold">On Hold</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Deadline"
            name="Deadline"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.Deadline}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>
        Create
      </Button>
    </Paper>
  );
}
