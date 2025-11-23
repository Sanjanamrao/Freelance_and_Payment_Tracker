import supabase from './supabase';

export async function getPayments() {
  const { data, error } = await supabase.from('payments').select('*');
  if (error) throw error;
  return data || [];
}

export async function getPayment(id) {
  const { data, error } = await supabase.from('payments').select('*').eq('PaymentID', id).single();
  if (error) throw error;
  return data || null;
}

export async function createPayment(payload) {
  const { data, error } = await supabase.rpc('record_payment', {
    _invoice: payload.InvoiceID,
    _amount: payload.AmountPaid,
    _mode: payload.Mode
  });
  if (error) throw error;
  return data;
}

export async function deletePayment(id) {
  const { error } = await supabase.rpc('delete_payment', { _id: id });
  if (error) throw error;
  return true;
}
