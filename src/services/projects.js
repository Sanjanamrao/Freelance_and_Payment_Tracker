//services/projects.js

import supabase from './supabase';

// Get all projects
export async function getProjects() {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) throw error;
  return data || [];
}

// Get a single project by ID
export async function getProject(id) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id) // use 'id' if your schema defines uuid PK
    .single();

  if (error) throw error;
  return data || null;
}

// Create a new project
export async function createProject(payload) {
  const { data, error } = await supabase
    .from('projects')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data || null;
}

// Update a project
export async function updateProject(id, payload) {
  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id) // align with schema
    .select()
    .single();

  if (error) throw error;
  return data || null;
}

// Delete a project
export async function deleteProject(id) {
  const { data, error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
  return data || [];
}
