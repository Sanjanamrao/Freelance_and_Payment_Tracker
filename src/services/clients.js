import supabase from './supabase';

export async function createClient(payload) {
  const { data, error } = await supabase.rpc('add_client', {
    _name: payload.name,
    _email: payload.email
  });
  if (error) throw error;
  return data;
}

export async function getClients() {
  const { data, error } = await supabase.from('clientsummaryview').select('*');
  if (error) throw error;
  return data || [];
}
