// src/services/clients.js
import supabase from './supabase';

/**
 * Create client (freelancers only)
 */
export async function createClient(payload) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify user is a freelancer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile.role !== 'freelancer') {
      throw new Error('Only freelancers can create clients');
    }

    // Call the stored procedure
    const { data, error } = await supabase.rpc('add_client', {
      _name: payload.name,
      _email: payload.email,
      _created_by: user.id
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

/**
 * Get clients (freelancers see their clients only)
 */
export async function getClients() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    // Only freelancers can view clients
    if (profile.role !== 'freelancer') {
      return [];
    }

    // Get clients created by this freelancer
    const { data, error } = await supabase
      .from('clientsummaryview')
      .select('*')
      .eq('created_by', user.id);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

/**
 * Get single client
 */
export async function getClient(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('created_by', user.id)
      .single();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching client:', error);
    throw error;
  }
}

/**
 * Update client (must be created by current user)
 */
export async function updateClient(id, payload) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: client } = await supabase
      .from('clients')
      .select('created_by')
      .eq('id', id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    if (client.created_by !== user.id) {
      throw new Error('Unauthorized: You can only update your own clients');
    }

    const { data, error } = await supabase
      .from('clients')
      .update({
        name: payload.name,
        email: payload.email,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
}

/**
 * Delete client (must be created by current user)
 */
export async function deleteClient(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: client } = await supabase
      .from('clients')
      .select('created_by')
      .eq('id', id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    if (client.created_by !== user.id) {
      throw new Error('Unauthorized: You can only delete your own clients');
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
}