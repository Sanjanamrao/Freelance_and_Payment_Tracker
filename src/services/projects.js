import supabase from './supabase';

export async function getProjects() {
  const { data, error } = await supabase.from('projectstatusview').select('*');
  if (error) throw error;
  return data || [];
}

export async function getProject(id) {
  const { data, error } = await supabase.from('projectstatusview').select('*').eq('projectid', id).single();
  if (error) throw error;
  return data || null;
}

export async function createProject(payload) {
  const { data, error } = await supabase.rpc('add_project', {
    _title: payload.title,
    _description: payload.description,
    _start: payload.startDate,
    _end: payload.endDate,
    _client: payload.clientId,
    _budget: payload.budget,
    _status: 'Pending'
  });

  if (error) throw error;
  return data;
}



export async function updateProject(id, payload) {
  const { error } = await supabase.rpc('update_project', {
    _id: id,
    _title: payload.Title,
    _description: payload.Description,
    _start: payload.StartDate,
    _end: payload.EndDate,
    _client: payload.ClientID,
    _budget: payload.budget,
    _status: payload.Status
  });
  if (error) throw error;
  return true;
}

export async function deleteProject(id) {
  const { error } = await supabase.rpc('delete_project', { _id: id });
  if (error) throw error;
  return true;
}
