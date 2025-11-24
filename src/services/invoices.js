// src/services/invoices.js
import supabase from './supabase';

/**
 * Get invoices based on user role
 * Freelancers see invoices they created
 * Clients see invoices sent to them
 */
export async function getInvoices() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    // Build query based on role
    let query = supabase.from('invoiceSummaryView').select('*');

    if (profile.role === 'freelancer') {
      query = query.eq('freelancer_id', user.id);
    } else if (profile.role === 'client') {
      query = query.eq('client_id', user.id);
    }

    const { data, error } = await query.order('IssueDate', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

/**
 * Get single invoice (with role check)
 */
export async function getInvoice(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('invoiceSummaryView')
      .select('*')
      .eq('InvoiceID', id)
      .single();

    if (error) throw error;

    // Verify user has access to this invoice
    if (data.freelancer_id !== user.id && data.client_id !== user.id) {
      throw new Error('Unauthorized access to invoice');
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
}

/**
 * Create invoice (freelancers only)
 * Automatically sets freelancer_id to current user
 */
export async function createInvoice(payload) {
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
      throw new Error('Only freelancers can create invoices');
    }

    // Get project to find client_id
    const { data: project } = await supabase
      .from('projects')
      .select('client_id')
      .eq('ProjectID', payload.ProjectID)
      .single();

    if (!project) {
      throw new Error('Project not found');
    }

    // Call the stored procedure
    const { data, error } = await supabase.rpc('createInvoice', {
      _project: payload.ProjectID,
      _amount: payload.Amount,
      _issue: payload.IssueDate,
      _due: payload.DueDate,
      _freelancer: user.id,
      _client: project.client_id
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

/**
 * Delete invoice (freelancers only, must own the invoice)
 */
export async function deleteInvoice(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: invoice } = await supabase
      .from('invoices')
      .select('freelancer_id')
      .eq('InvoiceID', id)
      .single();

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.freelancer_id !== user.id) {
      throw new Error('Unauthorized: You can only delete your own invoices');
    }

    const { error } = await supabase.rpc('deleteInvoice', { _id: id });
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}