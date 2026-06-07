/**
 * Data Service Layer
 * Provides unified data access — tries Supabase first, falls back to mock data.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import * as mock from '../data/mockData';

// ==================== HELPERS ====================

let _supabaseAvailable = null; // cached after first check

async function isSupabaseAvailable() {
  if (!isSupabaseConfigured) return false;
  if (_supabaseAvailable !== null) return _supabaseAvailable;
  try {
    const { error } = await supabase.from('departments').select('id').limit(1);
    _supabaseAvailable = !error;
  } catch {
    _supabaseAvailable = false;
  }
  return _supabaseAvailable;
}

// Reset cache (useful after running the schema)
export function resetAvailabilityCache() {
  _supabaseAvailable = null;
}

// Generic query helper
async function query(table, options = {}) {
  if (!(await isSupabaseAvailable())) return null;
  try {
    let q = supabase.from(table).select(options.select || '*');
    if (options.eq) Object.entries(options.eq).forEach(([k, v]) => { q = q.eq(k, v); });
    if (options.order) q = q.order(options.order, { ascending: options.ascending ?? false });
    if (options.limit) q = q.limit(options.limit);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn(`Supabase query failed for ${table}:`, e.message);
    return null;
  }
}

async function insert(table, row) {
  if (!(await isSupabaseAvailable())) return null;
  try {
    const { data, error } = await supabase.from(table).insert(row).select();
    if (error) throw error;
    return data?.[0];
  } catch (e) {
    console.warn(`Supabase insert failed for ${table}:`, e.message);
    return null;
  }
}

async function update(table, id, changes) {
  if (!(await isSupabaseAvailable())) return null;
  try {
    const { data, error } = await supabase.from(table).update(changes).eq('id', id).select();
    if (error) throw error;
    return data?.[0];
  } catch (e) {
    console.warn(`Supabase update failed for ${table}:`, e.message);
    return null;
  }
}

// ==================== DEPARTMENTS ====================

export async function getDepartments() {
  const data = await query('departments');
  return data || mock.DEPARTMENTS;
}

// ==================== ATTENDANCE ====================

export async function getAttendanceRecords(userId) {
  const data = await query('attendance', {
    eq: userId ? { user_id: userId } : undefined,
    order: 'date',
    ascending: true,
  });
  if (data) {
    return data.map(r => ({
      id: r.id,
      date: r.date,
      checkIn: r.check_in?.substring(0, 5),
      checkOut: r.check_out?.substring(0, 5),
      status: r.status,
      workedHours: parseFloat(r.worked_hours) || 0,
      isLate: r.is_late,
    }));
  }
  return mock.generateAttendanceRecords();
}

export async function checkIn(userId) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const isLate = now.getHours() >= 10;
  const result = await insert('attendance', {
    user_id: userId,
    date: now.toISOString().split('T')[0],
    check_in: time,
    status: isLate ? 'late' : 'checked-in',
    is_late: isLate,
  });
  return result ? time : time; // always return time for UI
}

export async function checkOut(userId) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (await isSupabaseAvailable()) {
    const today = now.toISOString().split('T')[0];
    await supabase.from('attendance')
      .update({ check_out: time, status: 'present' })
      .eq('user_id', userId)
      .eq('date', today);
  }
  return time;
}

// ==================== LEAVE ====================

export async function getLeaveTypes() {
  const data = await query('leave_types');
  if (data) {
    return data.map(lt => ({
      type: lt.name,
      total: lt.total_days,
      used: 0,
      color: lt.color,
    }));
  }
  return mock.LEAVE_TYPES;
}

export async function getLeaveRequests(userId) {
  const data = await query('leave_requests', { order: 'created_at' });
  if (data) {
    return data.map(r => ({
      id: r.id,
      employee: 'Current User',
      type: r.leave_type,
      from: r.from_date,
      to: r.to_date,
      days: r.days,
      reason: r.reason,
      status: r.status,
      appliedOn: r.applied_on,
    }));
  }
  return mock.LEAVE_REQUESTS;
}

export async function submitLeaveRequest(userId, data) {
  const result = await insert('leave_requests', {
    user_id: userId,
    leave_type: data.type,
    from_date: data.from,
    to_date: data.to,
    days: data.days,
    reason: data.reason,
  });
  return result;
}

export async function updateLeaveStatus(id, status, approvedBy) {
  return await update('leave_requests', id, { status, approved_by: approvedBy });
}

// ==================== HOLIDAYS ====================

export async function getHolidays() {
  const data = await query('holidays', { order: 'date', ascending: true });
  return data || mock.HOLIDAYS;
}

// ==================== PAYROLL ====================

export async function getPayrollData(userId) {
  const data = await query('payroll', {
    eq: userId ? { user_id: userId } : undefined,
    order: 'created_at',
  });
  if (data && data.length > 0) {
    const current = data[data.length - 1];
    return {
      currentMonth: {
        basic: parseFloat(current.basic),
        hra: parseFloat(current.hra),
        da: parseFloat(current.da),
        specialAllowance: parseFloat(current.special_allowance),
        transportAllowance: parseFloat(current.transport_allowance),
        medicalAllowance: parseFloat(current.medical_allowance),
        grossSalary: parseFloat(current.gross_salary),
        pf: parseFloat(current.pf),
        professionalTax: parseFloat(current.professional_tax),
        incomeTax: parseFloat(current.income_tax),
        insurance: parseFloat(current.insurance),
        totalDeductions: parseFloat(current.total_deductions),
        netSalary: parseFloat(current.net_salary),
      },
      history: data.map(r => ({
        month: r.month,
        gross: parseFloat(r.gross_salary),
        deductions: parseFloat(r.total_deductions),
        net: parseFloat(r.net_salary),
        paidOn: r.paid_on,
      })),
      reimbursements: mock.PAYROLL_DATA.reimbursements,
    };
  }
  return mock.PAYROLL_DATA;
}

// ==================== TASKS ====================

export async function getTasks() {
  const data = await query('tasks', { order: 'created_at' });
  if (data) {
    return data.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      project: t.project_name,
      assignee: t.assignee,
      priority: t.priority,
      status: t.status,
      dueDate: t.due_date,
      tags: t.tags || [],
    }));
  }
  return mock.TASKS;
}

export async function createTask(taskData) {
  return await insert('tasks', {
    title: taskData.title,
    project_name: taskData.project,
    assignee: taskData.assignee,
    priority: taskData.priority,
    due_date: taskData.dueDate,
    description: taskData.description,
  });
}

export async function updateTaskStatus(id, status) {
  return await update('tasks', id, { status });
}

// ==================== PROJECTS ====================

export async function getProjects() {
  const data = await query('projects');
  return data || mock.PROJECTS;
}

// ==================== TIMESHEET ====================

export async function getTimesheetEntries(userId) {
  const data = await query('timesheet_entries', {
    eq: userId ? { user_id: userId } : undefined,
    order: 'date',
    ascending: true,
  });
  if (data) {
    return data.map(e => ({
      date: e.date,
      project: e.project,
      task: e.task,
      hours: parseFloat(e.hours),
      notes: e.notes,
    }));
  }
  return mock.TIMESHEET_DATA;
}

export async function addTimesheetEntry(userId, entry) {
  return await insert('timesheet_entries', {
    user_id: userId,
    date: entry.date,
    project: entry.project,
    task: entry.task,
    hours: parseFloat(entry.hours),
    notes: entry.notes,
  });
}

// ==================== DOCUMENTS ====================

export async function getDocuments() {
  const data = await query('documents', { order: 'upload_date' });
  if (data) {
    return data.map(d => ({
      id: d.id,
      name: d.name,
      category: d.category,
      size: d.size,
      type: d.type,
      uploadedBy: d.uploaded_by,
      uploadDate: d.upload_date,
      downloads: d.downloads,
    }));
  }
  return mock.DOCUMENTS;
}

// ==================== ANNOUNCEMENTS ====================

export async function getAnnouncements() {
  const data = await query('announcements', { order: 'date' });
  return data || mock.ANNOUNCEMENTS;
}

// ==================== COMMUNICATION / EMPLOYEES ====================

export async function getEmployees() {
  const data = await query('profiles');
  if (data) {
    return data.map(p => ({
      id: p.employee_id || p.id,
      name: p.full_name || `${p.first_name} ${p.last_name}`,
      email: p.email,
      department: p.department,
      designation: p.designation,
      status: p.status,
      phone: p.phone,
      joinDate: p.join_date,
    }));
  }
  return mock.EMPLOYEES;
}

// ==================== PERFORMANCE ====================

export async function getPerformanceData(userId) {
  const [goals, reviews] = await Promise.all([
    query('performance_goals', { eq: userId ? { user_id: userId } : undefined }),
    query('performance_reviews', { eq: userId ? { user_id: userId } : undefined }),
  ]);

  if (goals || reviews) {
    return {
      goals: goals?.map(g => ({
        id: g.id,
        title: g.title,
        category: g.category,
        progress: g.progress,
        status: g.status,
        dueDate: g.due_date,
        weight: g.weight,
      })) || mock.PERFORMANCE_DATA.goals,
      kpis: mock.PERFORMANCE_DATA.kpis, // KPIs stay as mock for now
      reviews: reviews?.map(r => ({
        period: r.period,
        rating: parseFloat(r.rating),
        reviewer: r.reviewer,
        date: r.review_date,
        summary: r.summary,
      })) || mock.PERFORMANCE_DATA.reviews,
    };
  }
  return mock.PERFORMANCE_DATA;
}

// ==================== RECRUITMENT ====================

export async function getJobOpenings() {
  const data = await query('job_openings', { order: 'posted' });
  if (data) {
    return data.map(j => ({
      id: j.id,
      title: j.title,
      department: j.department,
      type: j.type,
      location: j.location,
      salary: j.salary,
      status: j.status,
      applicants: j.applicants,
    }));
  }
  return mock.JOB_OPENINGS;
}

export async function getCandidates() {
  const data = await query('candidates', { order: 'applied_date' });
  if (data) {
    return data.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      job: c.job,
      stage: c.stage,
      rating: parseFloat(c.rating),
      appliedDate: c.applied_date,
    }));
  }
  return mock.CANDIDATES;
}

// ==================== TRAINING ====================

export async function getCourses() {
  const data = await query('courses');
  if (data) {
    return data.map(c => ({
      id: c.id,
      title: c.title,
      category: c.category,
      instructor: c.instructor,
      duration: c.duration,
      progress: c.progress,
      status: c.status,
      enrolled: c.enrolled,
      description: c.description,
    }));
  }
  return mock.COURSES;
}

// ==================== HELPDESK ====================

export async function getTickets() {
  const data = await query('tickets', { order: 'created_at' });
  if (data) {
    return data.map(t => ({
      id: t.id,
      subject: t.subject,
      description: t.description,
      category: t.category,
      priority: t.priority,
      status: t.status,
      createdBy: t.created_by,
      assignedTo: t.assigned_to,
      createdAt: t.created_at?.split('T')[0],
    }));
  }
  return mock.TICKETS;
}

export async function createTicket(userId, ticket) {
  return await insert('tickets', {
    subject: ticket.subject,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    created_by_id: userId,
    created_by: ticket.createdBy || 'Current User',
  });
}

// ==================== ASSETS ====================

export async function getAssets() {
  const data = await query('assets');
  if (data) {
    return data.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      serialNumber: a.serial_number,
      assignedTo: a.assigned_to,
      assignedDate: a.assigned_date,
      condition: a.condition,
      status: a.status,
    }));
  }
  return mock.ASSETS;
}

// ==================== EXPENSES ====================

export async function getExpenses(userId) {
  const data = await query('expenses', { order: 'created_at' });
  if (data) {
    return data.map(e => ({
      id: e.id,
      title: e.title,
      category: e.category,
      amount: parseFloat(e.amount),
      date: e.date,
      status: e.status,
      receipt: e.receipt,
    }));
  }
  return mock.EXPENSES;
}

export async function submitExpense(userId, expense) {
  return await insert('expenses', {
    user_id: userId,
    title: expense.title,
    category: expense.category,
    amount: parseFloat(expense.amount),
    date: expense.date,
  });
}

// ==================== CALENDAR / EVENTS ====================

export async function getEvents() {
  const data = await query('events', { order: 'date', ascending: true });
  return data || mock.EVENTS;
}

// ==================== NOTIFICATIONS ====================

export async function getNotifications(userId) {
  const data = await query('notifications', {
    eq: userId ? { user_id: userId } : undefined,
    order: 'created_at',
  });
  if (data) {
    return data.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      timestamp: n.created_at,
    }));
  }
  return mock.NOTIFICATIONS;
}

export async function markNotificationRead(id) {
  return await update('notifications', id, { read: true });
}

// ==================== ADMIN ====================

export async function getAuditLogs() {
  const data = await query('audit_logs', { order: 'timestamp' });
  if (data) {
    return data.map(l => ({
      id: l.id,
      action: l.action,
      user: l.user_name,
      timestamp: l.timestamp,
      ip: l.ip,
      details: l.details,
    }));
  }
  return mock.AUDIT_LOGS;
}

export async function addAuditLog(action, user, details) {
  return await insert('audit_logs', {
    action,
    user_name: user,
    details,
    ip: 'client',
  });
}

// ==================== PROFILE ====================

export async function getProfile(userId) {
  if (!(await isSupabaseAvailable())) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function updateProfile(userId, changes) {
  return await update('profiles', userId, { ...changes, updated_at: new Date().toISOString() });
}
