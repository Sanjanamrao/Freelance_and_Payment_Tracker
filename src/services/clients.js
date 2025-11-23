// services/clients.js

import supabase from './supabase';

// Create a client and return the inserted row
export async function createClient(payload) {
  const { data, error } = await supabase
    .from('clients')
    .insert([payload]) // ensure array format
    .select()
    .single();

  if (error) throw error;
  return data || null;
}

// List all clients
export async function getClients() {
  const { data, error } = await supabase.from('clients').select('*');
  if (error) throw error;
  return data || [];
}
