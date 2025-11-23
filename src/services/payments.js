import supabase from './supabase';

// Get all payments
export async function getPayments() {
  const { data, error } = await supabase.from('payments').select('*');
  if (error) throw error;
  return data || [];
}

// Get a single payment by ID
export async function getPayment(id) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id) // align with your schema
    .single();
  if (error) throw error;
  return data || null;
}

// Create a new payment
export async function createPayment(payload) {
  const { data, error } = await supabase
    .from('payments')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data || null;
}

// Delete a payment
export async function deletePayment(id) {
  const { data, error } = await supabase.from('payments').delete().eq('id', id);
  if (error) throw error;
  return data || [];
}
