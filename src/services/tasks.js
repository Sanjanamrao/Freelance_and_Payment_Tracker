import supabase from './supabase';

export async function getTasks() {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) throw error;
  return data || [];
}

export async function getTasksByProject(projectId) {
  const { data, error } = await supabase.from('tasks').select('*').eq('ProjectID', projectId);
  if (error) throw error;
  return data || [];
}

export async function createTask(payload) {
  const { data, error } = await supabase.rpc('add_task', {
    _project: payload.ProjectID,
    _title: payload.Title,
    _status: payload.Status || 'Pending',
    _deadline: payload.Deadline
  });
  if (error) throw error;
  return data;
}

export async function updateTask(id, payload) {
  const { error } = await supabase.rpc('update_task', {
    _id: id,
    _title: payload.Title,
    _status: payload.Status,
    _deadline: payload.Deadline
  });
  if (error) throw error;
  return true;
}

export async function deleteTask(id) {
  const { error } = await supabase.rpc('delete_task', { _id: id });
  if (error) throw error;
  return true;
}
