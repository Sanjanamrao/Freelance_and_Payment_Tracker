import supabase from './supabase';

// Get all tasks
export async function getTasks() {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) throw error;
  return data || [];
}

// Get a single task by ID
export async function getTask(id) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data || null;
}

// Create a new task
export async function createTask(payload) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data || null;
}

// Update a task
export async function updateTask(id, payload) {
  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data || null;
}

// Delete a task
export async function deleteTask(id) {
  const { data, error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
  return data || [];
}
