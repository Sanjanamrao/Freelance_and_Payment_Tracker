import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { createTask } from '../services/tasks';

export default function TaskFormDialog({ open, onClose, onSuccess, projectId }) {
  const [form, setForm] = useState({ title: '', status: '', deadline: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await createTask({
        ProjectID: projectId,
        Title: form.title,
        Status: form.status,
        Deadline: form.deadline,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField label="Title" name="title" fullWidth margin="normal" value={form.title} onChange={handleChange} />
        <TextField label="Status" name="status" fullWidth margin="normal" value={form.status} onChange={handleChange} />
        <TextField label="Deadline" name="deadline" type="date" fullWidth margin="normal" value={form.deadline} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
