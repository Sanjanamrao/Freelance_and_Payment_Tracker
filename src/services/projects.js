// src/services/projects.js
import supabase from './supabase';

/**
 * Get projects based on user role
 * Freelancers see their projects
 * Clients see projects they're assigned to
 */
export async function getProjects() {
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
    let query = supabase.from('projectstatusview').select('*');

    if (profile.role === 'freelancer') {
      query = query.eq('freelancer_id', user.id);
    } else if (profile.role === 'client') {
      query = query.eq('client_id', user.id);
    }

    const { data, error } = await query.order('StartDate', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Get single project (with role check)
 */
export async function getProject(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('projectstatusview')
      .select('*')
      .eq('projectid', id)
      .single();

    if (error) throw error;

    // Verify user has access to this project
    if (data.freelancer_id !== user.id && data.client_id !== user.id) {
      throw new Error('Unauthorized access to project');
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

/**
 * Create project (freelancers only)
 * Automatically sets freelancer_id to current user
 */
export async function createProject(payload) {
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
      throw new Error('Only freelancers can create projects');
    }

    // Call the stored procedure
    const { data, error } = await supabase.rpc('add_project', {
      _title: payload.title,
      _description: payload.description,
      _start: payload.startDate,
      _end: payload.endDate,
      _client: payload.clientId,
      _budget: payload.budget,
      _status: 'Pending',
      _freelancer: user.id
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Update project (freelancers only, must own the project)
 */
export async function updateProject(id, payload) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('freelancer_id')
      .eq('ProjectID', id)
      .single();

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.freelancer_id !== user.id) {
      throw new Error('Unauthorized: You can only update your own projects');
    }

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
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

/**
 * Delete project (freelancers only, must own the project)
 */
export async function deleteProject(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Verify ownership
    const { data: project } = await supabase
      .from('projects')
      .select('freelancer_id')
      .eq('ProjectID', id)
      .single();

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.freelancer_id !== user.id) {
      throw new Error('Unauthorized: You can only delete your own projects');
    }

    const { error } = await supabase.rpc('delete_project', { _id: id });
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}