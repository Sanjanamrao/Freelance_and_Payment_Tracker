import supabase from './supabase';

export async function getInvoices() {
  const { data, error } = await supabase.from('invoiceSummaryView').select('*');
  if (error) throw error;
  return data || [];
}

export async function getInvoice(id) {
  const { data, error } = await supabase.from('invoiceSummaryView').select('*').eq('InvoiceID', id).single();
  if (error) throw error;
  return data || null;
}

export async function createInvoice(payload) {
  const { data, error } = await supabase.rpc('createInvoice', {
    _project: payload.ProjectID,
    _amount: payload.Amount,
    _issue: payload.IssueDate,
    _due: payload.DueDate
  });
  if (error) throw error;
  return data;
}

export async function deleteInvoice(id) {
  const { error } = await supabase.rpc('deleteInvoice', { _id: id });
  if (error) throw error;
  return true;
}
