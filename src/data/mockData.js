// ============================================================
// TIA Software Solutions — Employee Management Portal
// Complete Mock Data & LocalStorage Utilities
// ============================================================

// ==================== DEMO USERS ====================
export const DEMO_USERS = [
  {
    id: 'USR001',
    email: 'admin@tia.com',
    password: 'admin123',
    role: 'admin',
    name: 'Rajesh Kumar',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    avatar: null,
    designation: 'System Administrator',
    department: 'IT',
    employeeId: 'TIA-001',
    phone: '+91 98765 43210',
    joinDate: '2020-01-15',
  },
  {
    id: 'USR002',
    email: 'hr@tia.com',
    password: 'hr123',
    role: 'hr',
    name: 'Priya Sharma',
    firstName: 'Priya',
    lastName: 'Sharma',
    avatar: null,
    designation: 'HR Manager',
    department: 'Human Resources',
    employeeId: 'TIA-002',
    phone: '+91 98765 43211',
    joinDate: '2020-03-10',
  },
  {
    id: 'USR003',
    email: 'manager@tia.com',
    password: 'manager123',
    role: 'manager',
    name: 'Arjun Mehta',
    firstName: 'Arjun',
    lastName: 'Mehta',
    avatar: null,
    designation: 'Engineering Manager',
    department: 'Engineering',
    employeeId: 'TIA-003',
    phone: '+91 98765 43212',
    joinDate: '2020-06-20',
  },
  {
    id: 'USR004',
    email: 'employee@tia.com',
    password: 'employee123',
    role: 'employee',
    name: 'Ananya Patel',
    firstName: 'Ananya',
    lastName: 'Patel',
    avatar: null,
    designation: 'Software Engineer',
    department: 'Engineering',
    employeeId: 'TIA-004',
    phone: '+91 98765 43213',
    joinDate: '2022-08-01',
  },
];

// ==================== DEPARTMENTS ====================
export const DEPARTMENTS = [
  { id: 'DEP001', name: 'Engineering', head: 'Arjun Mehta', employeeCount: 45, color: '#4f46e5' },
  { id: 'DEP002', name: 'Human Resources', head: 'Priya Sharma', employeeCount: 12, color: '#ac40f2' },
  { id: 'DEP003', name: 'Marketing', head: 'Vikram Singh', employeeCount: 18, color: '#f59e0b' },
  { id: 'DEP004', name: 'Sales', head: 'Neha Gupta', employeeCount: 25, color: '#22c55e' },
  { id: 'DEP005', name: 'Finance', head: 'Amit Joshi', employeeCount: 10, color: '#3b82f6' },
  { id: 'DEP006', name: 'Design', head: 'Kavitha Reddy', employeeCount: 15, color: '#ec4899' },
  { id: 'DEP007', name: 'Operations', head: 'Suresh Nair', employeeCount: 8, color: '#14b8a6' },
  { id: 'DEP008', name: 'IT', head: 'Rajesh Kumar', employeeCount: 20, color: '#f97316' },
];

// ==================== EMPLOYEES ====================
export const EMPLOYEES = [
  { id: 'EMP001', name: 'Rajesh Kumar', email: 'rajesh@tia.com', department: 'IT', designation: 'System Administrator', phone: '+91 98765 43210', status: 'active', joinDate: '2020-01-15', manager: null, avatar: null },
  { id: 'EMP002', name: 'Priya Sharma', email: 'priya@tia.com', department: 'Human Resources', designation: 'HR Manager', phone: '+91 98765 43211', status: 'active', joinDate: '2020-03-10', manager: null, avatar: null },
  { id: 'EMP003', name: 'Arjun Mehta', email: 'arjun@tia.com', department: 'Engineering', designation: 'Engineering Manager', phone: '+91 98765 43212', status: 'active', joinDate: '2020-06-20', manager: null, avatar: null },
  { id: 'EMP004', name: 'Ananya Patel', email: 'ananya@tia.com', department: 'Engineering', designation: 'Software Engineer', phone: '+91 98765 43213', status: 'active', joinDate: '2022-08-01', manager: 'Arjun Mehta', avatar: null },
  { id: 'EMP005', name: 'Vikram Singh', email: 'vikram@tia.com', department: 'Marketing', designation: 'Marketing Director', phone: '+91 98765 43214', status: 'active', joinDate: '2021-02-15', manager: null, avatar: null },
  { id: 'EMP006', name: 'Neha Gupta', email: 'neha@tia.com', department: 'Sales', designation: 'Sales Lead', phone: '+91 98765 43215', status: 'active', joinDate: '2021-04-22', manager: null, avatar: null },
  { id: 'EMP007', name: 'Kavitha Reddy', email: 'kavitha@tia.com', department: 'Design', designation: 'Lead Designer', phone: '+91 98765 43216', status: 'active', joinDate: '2021-07-01', manager: null, avatar: null },
  { id: 'EMP008', name: 'Rohit Verma', email: 'rohit@tia.com', department: 'Engineering', designation: 'Senior Developer', phone: '+91 98765 43217', status: 'active', joinDate: '2021-09-15', manager: 'Arjun Mehta', avatar: null },
  { id: 'EMP009', name: 'Deepa Nair', email: 'deepa@tia.com', department: 'Finance', designation: 'Financial Analyst', phone: '+91 98765 43218', status: 'active', joinDate: '2022-01-10', manager: 'Amit Joshi', avatar: null },
  { id: 'EMP010', name: 'Sanjay Rao', email: 'sanjay@tia.com', department: 'Engineering', designation: 'DevOps Engineer', phone: '+91 98765 43219', status: 'active', joinDate: '2022-03-20', manager: 'Arjun Mehta', avatar: null },
  { id: 'EMP011', name: 'Meera Iyer', email: 'meera@tia.com', department: 'Design', designation: 'UI/UX Designer', phone: '+91 98765 43220', status: 'active', joinDate: '2022-05-15', manager: 'Kavitha Reddy', avatar: null },
  { id: 'EMP012', name: 'Karthik Sundaram', email: 'karthik@tia.com', department: 'Engineering', designation: 'Full Stack Developer', phone: '+91 98765 43221', status: 'active', joinDate: '2022-07-01', manager: 'Arjun Mehta', avatar: null },
  { id: 'EMP013', name: 'Lakshmi Venkat', email: 'lakshmi@tia.com', department: 'Human Resources', designation: 'HR Executive', phone: '+91 98765 43222', status: 'active', joinDate: '2022-09-12', manager: 'Priya Sharma', avatar: null },
  { id: 'EMP014', name: 'Aditya Chopra', email: 'aditya@tia.com', department: 'Marketing', designation: 'Content Strategist', phone: '+91 98765 43223', status: 'active', joinDate: '2023-01-05', manager: 'Vikram Singh', avatar: null },
  { id: 'EMP015', name: 'Sneha Kulkarni', email: 'sneha@tia.com', department: 'Sales', designation: 'Account Manager', phone: '+91 98765 43224', status: 'on-leave', joinDate: '2023-03-18', manager: 'Neha Gupta', avatar: null },
];

// ==================== ATTENDANCE RECORDS ====================
const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];

export const generateAttendanceRecords = () => {
  const records = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const isLate = Math.random() > 0.85;
    const checkInHour = isLate ? 9 + Math.floor(Math.random() * 2) : 8 + Math.floor(Math.random() * 1);
    const checkInMin = Math.floor(Math.random() * 59);
    const checkOutHour = 17 + Math.floor(Math.random() * 3);
    const checkOutMin = Math.floor(Math.random() * 59);
    const workedHours = checkOutHour - checkInHour + (checkOutMin - checkInMin) / 60;

    records.push({
      id: `ATT${String(records.length + 1).padStart(4, '0')}`,
      date: formatDate(date),
      checkIn: `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`,
      checkOut: i === 0 ? null : `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMin).padStart(2, '0')}`,
      status: i === 0 ? 'checked-in' : (isLate ? 'late' : 'present'),
      workedHours: i === 0 ? null : parseFloat(workedHours.toFixed(1)),
      isLate,
    });
  }
  return records;
};

// ==================== LEAVE DATA ====================
export const LEAVE_TYPES = [
  { type: 'Casual Leave', total: 12, used: 4, color: '#4f46e5' },
  { type: 'Sick Leave', total: 10, used: 2, color: '#ef4444' },
  { type: 'Earned Leave', total: 15, used: 6, color: '#22c55e' },
  { type: 'Compensatory Off', total: 5, used: 1, color: '#f59e0b' },
  { type: 'Maternity/Paternity', total: 180, used: 0, color: '#ec4899' },
  { type: 'Bereavement', total: 5, used: 0, color: '#6b7280' },
];

export const LEAVE_REQUESTS = [
  { id: 'LV001', employee: 'Ananya Patel', type: 'Casual Leave', from: '2026-06-10', to: '2026-06-11', days: 2, reason: 'Family function', status: 'pending', appliedOn: '2026-06-05' },
  { id: 'LV002', employee: 'Rohit Verma', type: 'Sick Leave', from: '2026-06-03', to: '2026-06-04', days: 2, reason: 'Fever and cold', status: 'approved', appliedOn: '2026-06-03', approvedBy: 'Arjun Mehta' },
  { id: 'LV003', employee: 'Meera Iyer', type: 'Earned Leave', from: '2026-06-15', to: '2026-06-20', days: 5, reason: 'Vacation trip', status: 'approved', appliedOn: '2026-05-28', approvedBy: 'Kavitha Reddy' },
  { id: 'LV004', employee: 'Karthik Sundaram', type: 'Casual Leave', from: '2026-06-12', to: '2026-06-12', days: 1, reason: 'Personal work', status: 'rejected', appliedOn: '2026-06-06', rejectedBy: 'Arjun Mehta', rejectReason: 'Critical release pending' },
  { id: 'LV005', employee: 'Sanjay Rao', type: 'Compensatory Off', from: '2026-06-08', to: '2026-06-08', days: 1, reason: 'Worked on Saturday', status: 'approved', appliedOn: '2026-06-02', approvedBy: 'Arjun Mehta' },
  { id: 'LV006', employee: 'Deepa Nair', type: 'Casual Leave', from: '2026-06-18', to: '2026-06-19', days: 2, reason: 'Moving to new apartment', status: 'pending', appliedOn: '2026-06-06' },
];

// ==================== HOLIDAYS ====================
export const HOLIDAYS = [
  { date: '2026-01-01', name: 'New Year', type: 'public' },
  { date: '2026-01-26', name: 'Republic Day', type: 'national' },
  { date: '2026-03-14', name: 'Holi', type: 'public' },
  { date: '2026-04-02', name: 'Good Friday', type: 'public' },
  { date: '2026-04-14', name: 'Dr. Ambedkar Jayanti', type: 'national' },
  { date: '2026-05-01', name: 'May Day', type: 'public' },
  { date: '2026-06-17', name: 'Eid ul-Fitr', type: 'public' },
  { date: '2026-07-06', name: 'Rath Yatra', type: 'optional' },
  { date: '2026-08-15', name: 'Independence Day', type: 'national' },
  { date: '2026-09-02', name: 'Ganesh Chaturthi', type: 'public' },
  { date: '2026-10-02', name: 'Gandhi Jayanti', type: 'national' },
  { date: '2026-10-20', name: 'Dussehra', type: 'public' },
  { date: '2026-11-09', name: 'Diwali', type: 'public' },
  { date: '2026-12-25', name: 'Christmas', type: 'public' },
];

// ==================== PAYROLL DATA ====================
export const PAYROLL_DATA = {
  currentMonth: {
    month: 'June 2026',
    basic: 65000,
    hra: 26000,
    da: 6500,
    specialAllowance: 15000,
    transportAllowance: 3000,
    medicalAllowance: 2500,
    grossSalary: 118000,
    pf: 7800,
    professionalTax: 200,
    incomeTax: 12500,
    insurance: 1500,
    totalDeductions: 22000,
    netSalary: 96000,
    status: 'processed',
    paidOn: '2026-06-01',
  },
  history: [
    { month: 'May 2026', gross: 118000, deductions: 22000, net: 96000, status: 'paid', paidOn: '2026-05-01' },
    { month: 'Apr 2026', gross: 118000, deductions: 22000, net: 96000, status: 'paid', paidOn: '2026-04-01' },
    { month: 'Mar 2026', gross: 115000, deductions: 21500, net: 93500, status: 'paid', paidOn: '2026-03-01' },
    { month: 'Feb 2026', gross: 115000, deductions: 21500, net: 93500, status: 'paid', paidOn: '2026-02-01' },
    { month: 'Jan 2026', gross: 115000, deductions: 21500, net: 93500, status: 'paid', paidOn: '2026-01-01' },
    { month: 'Dec 2025', gross: 110000, deductions: 20800, net: 89200, status: 'paid', paidOn: '2025-12-01' },
  ],
  reimbursements: [
    { id: 'RMB001', type: 'Travel', amount: 5400, date: '2026-06-02', status: 'approved', description: 'Client visit - Mumbai' },
    { id: 'RMB002', type: 'Meal', amount: 1200, date: '2026-05-28', status: 'pending', description: 'Team lunch' },
    { id: 'RMB003', type: 'Equipment', amount: 8500, date: '2026-05-15', status: 'approved', description: 'Ergonomic keyboard' },
  ],
};

// ==================== TASKS & PROJECTS ====================
export const PROJECTS = [
  { id: 'PRJ001', name: 'TIA Portal Redesign', status: 'in-progress', progress: 65, deadline: '2026-07-30', lead: 'Arjun Mehta', team: ['EMP004', 'EMP008', 'EMP010', 'EMP012'] },
  { id: 'PRJ002', name: 'Mobile App V2', status: 'in-progress', progress: 40, deadline: '2026-08-15', lead: 'Rohit Verma', team: ['EMP004', 'EMP012'] },
  { id: 'PRJ003', name: 'Cloud Migration', status: 'planning', progress: 15, deadline: '2026-09-30', lead: 'Sanjay Rao', team: ['EMP010'] },
  { id: 'PRJ004', name: 'Brand Refresh Campaign', status: 'completed', progress: 100, deadline: '2026-05-31', lead: 'Vikram Singh', team: ['EMP014'] },
];

export const TASKS = [
  { id: 'TSK001', title: 'Design new dashboard UI', project: 'TIA Portal Redesign', assignee: 'Meera Iyer', priority: 'high', status: 'in-progress', dueDate: '2026-06-15', description: 'Create wireframes and mockups for the new employee dashboard', tags: ['design', 'ui'] },
  { id: 'TSK002', title: 'Implement auth module', project: 'TIA Portal Redesign', assignee: 'Ananya Patel', priority: 'critical', status: 'done', dueDate: '2026-06-08', description: 'Set up JWT auth with role-based access', tags: ['backend', 'security'] },
  { id: 'TSK003', title: 'API integration - Leave module', project: 'TIA Portal Redesign', assignee: 'Karthik Sundaram', priority: 'medium', status: 'todo', dueDate: '2026-06-20', description: 'Connect frontend leave forms with REST API', tags: ['frontend', 'api'] },
  { id: 'TSK004', title: 'Setup CI/CD pipeline', project: 'Cloud Migration', assignee: 'Sanjay Rao', priority: 'high', status: 'in-progress', dueDate: '2026-06-18', description: 'Configure GitHub Actions for automated deployment', tags: ['devops'] },
  { id: 'TSK005', title: 'Performance testing', project: 'Mobile App V2', assignee: 'Rohit Verma', priority: 'medium', status: 'review', dueDate: '2026-06-12', description: 'Load testing with 1000 concurrent users', tags: ['testing', 'performance'] },
  { id: 'TSK006', title: 'Database schema optimization', project: 'TIA Portal Redesign', assignee: 'Arjun Mehta', priority: 'high', status: 'todo', dueDate: '2026-06-22', description: 'Optimize queries and add proper indexes', tags: ['database'] },
  { id: 'TSK007', title: 'Create social media content plan', project: 'Brand Refresh Campaign', assignee: 'Aditya Chopra', priority: 'low', status: 'done', dueDate: '2026-05-25', description: 'Monthly content calendar for all social platforms', tags: ['marketing', 'content'] },
  { id: 'TSK008', title: 'User acceptance testing', project: 'TIA Portal Redesign', assignee: 'Ananya Patel', priority: 'medium', status: 'todo', dueDate: '2026-07-01', description: 'End-to-end testing with stakeholders', tags: ['testing'] },
  { id: 'TSK009', title: 'Mobile responsive fixes', project: 'Mobile App V2', assignee: 'Karthik Sundaram', priority: 'high', status: 'in-progress', dueDate: '2026-06-14', description: 'Fix layout issues on tablet and mobile devices', tags: ['frontend', 'mobile'] },
  { id: 'TSK010', title: 'Security audit', project: 'Cloud Migration', assignee: 'Rajesh Kumar', priority: 'critical', status: 'todo', dueDate: '2026-06-25', description: 'Complete security assessment before migration', tags: ['security'] },
];

// ==================== TIMESHEET DATA ====================
export const TIMESHEET_DATA = [
  { date: '2026-06-02', project: 'TIA Portal Redesign', task: 'Dashboard UI', hours: 4, notes: 'Completed header and sidebar layout' },
  { date: '2026-06-02', project: 'Mobile App V2', task: 'Bug fixes', hours: 3, notes: 'Fixed login screen crash' },
  { date: '2026-06-03', project: 'TIA Portal Redesign', task: 'Auth module', hours: 6, notes: 'JWT implementation' },
  { date: '2026-06-03', project: 'TIA Portal Redesign', task: 'Code review', hours: 2, notes: 'Reviewed PR #142' },
  { date: '2026-06-04', project: 'Cloud Migration', task: 'Planning', hours: 3, notes: 'Architecture discussion' },
  { date: '2026-06-04', project: 'TIA Portal Redesign', task: 'API development', hours: 5, notes: 'Leave API endpoints' },
  { date: '2026-06-05', project: 'Mobile App V2', task: 'Responsive fixes', hours: 7, notes: 'Tablet layout overhaul' },
  { date: '2026-06-06', project: 'TIA Portal Redesign', task: 'Testing', hours: 4, notes: 'Unit tests for auth' },
  { date: '2026-06-06', project: 'Cloud Migration', task: 'CI/CD setup', hours: 4, notes: 'GitHub Actions config' },
];

// ==================== ANNOUNCEMENTS ====================
export const ANNOUNCEMENTS = [
  { id: 'ANN001', title: 'Annual Performance Review Cycle Starts June 15', content: 'All managers are requested to complete their team assessments by June 30. Please ensure all KPIs are updated in the system before the review meetings.', author: 'Priya Sharma', department: 'HR', date: '2026-06-06', priority: 'high', pinned: true },
  { id: 'ANN002', title: 'Office Renovation - 3rd Floor', content: 'The 3rd floor will be under renovation from June 10 to June 25. Teams stationed there will temporarily relocate to the 5th floor conference area.', author: 'Suresh Nair', department: 'Operations', date: '2026-06-05', priority: 'medium', pinned: true },
  { id: 'ANN003', title: 'New Employee Health Insurance Plan', content: 'We are upgrading our health insurance coverage. New plan includes dental and vision coverage. Details will be shared via email.', author: 'Priya Sharma', department: 'HR', date: '2026-06-04', priority: 'high', pinned: false },
  { id: 'ANN004', title: 'TIA Wins Best Digital Agency Award', content: 'Congratulations to the entire team! TIA Software Solutions has been awarded Best Digital Agency at the London Tech Awards 2026.', author: 'Rajesh Kumar', department: 'Management', date: '2026-06-02', priority: 'low', pinned: false },
  { id: 'ANN005', title: 'Quarterly Town Hall - June 28', content: 'Join us for the Q2 town hall meeting. Topics include company performance, upcoming projects, and team celebrations. Virtual link will be shared closer to the date.', author: 'Rajesh Kumar', department: 'Management', date: '2026-06-01', priority: 'medium', pinned: false },
  { id: 'ANN006', title: 'Team Building Activity - July 5', content: 'Mark your calendars for our annual team building day! This year we will have outdoor activities, team challenges, and a barbecue. More details coming soon.', author: 'Priya Sharma', department: 'HR', date: '2026-05-28', priority: 'low', pinned: false },
];

// ==================== TICKETS ====================
export const TICKETS = [
  { id: 'TKT001', subject: 'Cannot access VPN', category: 'IT Support', priority: 'high', status: 'open', createdBy: 'Ananya Patel', assignedTo: 'Rajesh Kumar', createdAt: '2026-06-06', description: 'Getting timeout error when connecting to VPN from home' },
  { id: 'TKT002', subject: 'Request for new laptop', category: 'IT Support', priority: 'medium', status: 'in-progress', createdBy: 'Rohit Verma', assignedTo: 'Rajesh Kumar', createdAt: '2026-06-04', description: 'Current laptop is 4 years old and running slow' },
  { id: 'TKT003', subject: 'Update tax declaration', category: 'HR Support', priority: 'low', status: 'resolved', createdBy: 'Deepa Nair', assignedTo: 'Priya Sharma', createdAt: '2026-06-02', resolvedAt: '2026-06-03', description: 'Need to update tax saving investments for FY 2026-27' },
  { id: 'TKT004', subject: 'Salary slip discrepancy', category: 'HR Support', priority: 'high', status: 'open', createdBy: 'Karthik Sundaram', assignedTo: 'Priya Sharma', createdAt: '2026-06-05', description: 'May salary slip showing incorrect HRA amount' },
  { id: 'TKT005', subject: 'Meeting room projector not working', category: 'IT Support', priority: 'medium', status: 'resolved', createdBy: 'Vikram Singh', assignedTo: 'Rajesh Kumar', createdAt: '2026-05-30', resolvedAt: '2026-06-01', description: 'Projector in Room 3B is not displaying properly' },
];

// ==================== ASSETS ====================
export const ASSETS = [
  { id: 'AST001', name: 'MacBook Pro 16"', type: 'Laptop', serialNumber: 'MBP-2026-001', assignedTo: 'Ananya Patel', assignedDate: '2022-08-01', condition: 'good', status: 'assigned' },
  { id: 'AST002', name: 'Dell UltraSharp 27"', type: 'Monitor', serialNumber: 'DU27-2023-012', assignedTo: 'Ananya Patel', assignedDate: '2022-08-01', condition: 'good', status: 'assigned' },
  { id: 'AST003', name: 'Herman Miller Aeron', type: 'Chair', serialNumber: 'HMA-2021-045', assignedTo: 'Ananya Patel', assignedDate: '2022-08-01', condition: 'good', status: 'assigned' },
  { id: 'AST004', name: 'iPhone 15 Pro', type: 'Phone', serialNumber: 'IP15-2025-008', assignedTo: 'Arjun Mehta', assignedDate: '2025-10-15', condition: 'excellent', status: 'assigned' },
  { id: 'AST005', name: 'ThinkPad X1 Carbon', type: 'Laptop', serialNumber: 'TP-2024-022', assignedTo: null, assignedDate: null, condition: 'good', status: 'available' },
  { id: 'AST006', name: 'Logitech MX Keys', type: 'Keyboard', serialNumber: 'LMX-2025-033', assignedTo: 'Rohit Verma', assignedDate: '2025-06-10', condition: 'good', status: 'assigned' },
];

// ==================== EXPENSES ====================
export const EXPENSES = [
  { id: 'EXP001', title: 'Client Meeting - Mumbai', category: 'Travel', amount: 15400, date: '2026-06-02', status: 'approved', receipt: true, approvedBy: 'Arjun Mehta' },
  { id: 'EXP002', title: 'Team Lunch - Project Celebration', category: 'Meals', amount: 3200, date: '2026-05-28', status: 'pending', receipt: true },
  { id: 'EXP003', title: 'Software License - Figma', category: 'Software', amount: 12000, date: '2026-05-15', status: 'approved', receipt: true, approvedBy: 'Arjun Mehta' },
  { id: 'EXP004', title: 'Conference Registration - DevSummit', category: 'Training', amount: 25000, date: '2026-05-10', status: 'approved', receipt: true, approvedBy: 'Priya Sharma' },
  { id: 'EXP005', title: 'Office Supplies', category: 'Office', amount: 2800, date: '2026-05-05', status: 'rejected', receipt: false, rejectedBy: 'Arjun Mehta', rejectReason: 'No receipt attached' },
];

// ==================== EVENTS & CALENDAR ====================
export const EVENTS = [
  { id: 'EVT001', title: 'Q2 Town Hall', date: '2026-06-28', time: '15:00', type: 'meeting', color: '#4f46e5', description: 'Quarterly company-wide meeting' },
  { id: 'EVT002', title: 'Sprint Planning', date: '2026-06-09', time: '10:00', type: 'meeting', color: '#3b82f6', description: 'Sprint 24 planning session' },
  { id: 'EVT003', title: 'Team Building Day', date: '2026-07-05', time: '09:00', type: 'event', color: '#22c55e', description: 'Annual team building activity' },
  { id: 'EVT004', title: 'Rohit\'s Birthday', date: '2026-06-15', time: null, type: 'birthday', color: '#ec4899', description: 'Birthday celebration' },
  { id: 'EVT005', title: 'Project Review', date: '2026-06-12', time: '14:00', type: 'meeting', color: '#f59e0b', description: 'TIA Portal milestone review' },
  { id: 'EVT006', title: 'Training: React Advanced', date: '2026-06-18', time: '11:00', type: 'training', color: '#ac40f2', description: 'Advanced React patterns workshop' },
  { id: 'EVT007', title: 'Eid ul-Fitr', date: '2026-06-17', time: null, type: 'holiday', color: '#14b8a6', description: 'Company Holiday' },
  { id: 'EVT008', title: 'Ananya\'s Anniversary', date: '2026-08-01', time: null, type: 'anniversary', color: '#f97316', description: '4th Work Anniversary' },
];

// ==================== NOTIFICATIONS ====================
export const NOTIFICATIONS = [
  { id: 'NOT001', title: 'Leave request approved', message: 'Your casual leave for June 10-11 has been approved by Arjun Mehta', type: 'approval', read: false, timestamp: '2026-06-07T09:30:00', icon: 'check-circle' },
  { id: 'NOT002', title: 'New task assigned', message: 'You have been assigned "API integration - Leave module"', type: 'task', read: false, timestamp: '2026-06-07T08:15:00', icon: 'clipboard' },
  { id: 'NOT003', title: 'Timesheet reminder', message: 'Please submit your timesheet for this week by Friday', type: 'reminder', read: false, timestamp: '2026-06-06T17:00:00', icon: 'clock' },
  { id: 'NOT004', title: 'Performance review scheduled', message: 'Your annual performance review is scheduled for June 20 at 2:00 PM', type: 'system', read: true, timestamp: '2026-06-06T14:20:00', icon: 'star' },
  { id: 'NOT005', title: 'Company announcement', message: 'TIA Wins Best Digital Agency Award - Read the full announcement', type: 'announcement', read: true, timestamp: '2026-06-02T10:00:00', icon: 'megaphone' },
  { id: 'NOT006', title: 'Salary credited', message: 'Your salary for June 2026 has been credited to your account', type: 'system', read: true, timestamp: '2026-06-01T06:00:00', icon: 'banknote' },
  { id: 'NOT007', title: 'New ticket update', message: 'Your IT support ticket #TKT001 has been assigned to Rajesh Kumar', type: 'system', read: false, timestamp: '2026-06-06T11:45:00', icon: 'headphones' },
  { id: 'NOT008', title: 'Document uploaded', message: 'New company policy document has been uploaded to the repository', type: 'system', read: true, timestamp: '2026-05-30T09:00:00', icon: 'file-text' },
];

// ==================== TRAINING & COURSES ====================
export const COURSES = [
  { id: 'CRS001', title: 'Advanced React Patterns', category: 'Technical', instructor: 'Arjun Mehta', duration: '16 hours', progress: 65, status: 'in-progress', startDate: '2026-05-01', endDate: '2026-06-30', enrolled: 24, description: 'Deep dive into hooks, patterns, and performance optimization' },
  { id: 'CRS002', title: 'AWS Cloud Practitioner', category: 'Cloud', instructor: 'External', duration: '40 hours', progress: 30, status: 'in-progress', startDate: '2026-04-15', endDate: '2026-07-15', enrolled: 15, description: 'AWS fundamentals and certification prep' },
  { id: 'CRS003', title: 'Leadership Essentials', category: 'Soft Skills', instructor: 'Priya Sharma', duration: '8 hours', progress: 100, status: 'completed', startDate: '2026-03-01', endDate: '2026-04-15', enrolled: 30, description: 'Essential management and leadership skills' },
  { id: 'CRS004', title: 'Cybersecurity Fundamentals', category: 'Security', instructor: 'Rajesh Kumar', duration: '12 hours', progress: 0, status: 'upcoming', startDate: '2026-07-01', endDate: '2026-08-15', enrolled: 8, description: 'Security best practices and threat prevention' },
  { id: 'CRS005', title: 'UI/UX Design Principles', category: 'Design', instructor: 'Kavitha Reddy', duration: '20 hours', progress: 85, status: 'in-progress', startDate: '2026-04-01', endDate: '2026-06-15', enrolled: 18, description: 'Modern design thinking and user experience' },
  { id: 'CRS006', title: 'Data Analytics with Python', category: 'Technical', instructor: 'External', duration: '32 hours', progress: 0, status: 'upcoming', startDate: '2026-08-01', endDate: '2026-10-01', enrolled: 0, description: 'Python for data analysis, visualization, and ML basics' },
];

// ==================== PERFORMANCE DATA ====================
export const PERFORMANCE_DATA = {
  goals: [
    { id: 'GL001', title: 'Complete Q2 deliverables', category: 'Project', progress: 72, status: 'on-track', dueDate: '2026-06-30', weight: 30 },
    { id: 'GL002', title: 'Achieve 95% code coverage', category: 'Quality', progress: 88, status: 'ahead', dueDate: '2026-06-30', weight: 20 },
    { id: 'GL003', title: 'Mentor 2 junior developers', category: 'Leadership', progress: 50, status: 'on-track', dueDate: '2026-12-31', weight: 15 },
    { id: 'GL004', title: 'Complete AWS certification', category: 'Learning', progress: 30, status: 'at-risk', dueDate: '2026-07-15', weight: 15 },
    { id: 'GL005', title: 'Reduce API response time by 40%', category: 'Performance', progress: 65, status: 'on-track', dueDate: '2026-09-30', weight: 20 },
  ],
  kpis: [
    { name: 'Code Quality', score: 92, target: 90, trend: 'up' },
    { name: 'Task Completion Rate', score: 87, target: 85, trend: 'up' },
    { name: 'Punctuality', score: 95, target: 95, trend: 'stable' },
    { name: 'Team Collaboration', score: 88, target: 85, trend: 'up' },
    { name: 'Innovation', score: 78, target: 80, trend: 'down' },
    { name: 'Communication', score: 90, target: 85, trend: 'up' },
  ],
  reviews: [
    { period: 'H2 2025', rating: 4.2, reviewer: 'Arjun Mehta', date: '2026-01-15', summary: 'Excellent technical skills and consistent delivery. Needs to improve cross-team collaboration.' },
    { period: 'H1 2025', rating: 3.8, reviewer: 'Arjun Mehta', date: '2025-07-15', summary: 'Good progress on assigned projects. Should take more initiative in team discussions.' },
    { period: 'H2 2024', rating: 3.5, reviewer: 'Rohit Verma', date: '2025-01-15', summary: 'Strong foundation as a new team member. Recommended for advanced training programs.' },
  ],
};

// ==================== RECRUITMENT DATA ====================
export const JOB_OPENINGS = [
  { id: 'JOB001', title: 'Senior React Developer', department: 'Engineering', type: 'Full-time', location: 'London / Remote', salary: '£65,000 - £85,000', status: 'active', applicants: 34, posted: '2026-05-20', closing: '2026-06-30' },
  { id: 'JOB002', title: 'UI/UX Designer', department: 'Design', type: 'Full-time', location: 'London', salary: '£45,000 - £60,000', status: 'active', applicants: 22, posted: '2026-05-25', closing: '2026-07-10' },
  { id: 'JOB003', title: 'DevOps Engineer', department: 'IT', type: 'Full-time', location: 'Remote', salary: '£70,000 - £90,000', status: 'active', applicants: 18, posted: '2026-06-01', closing: '2026-07-15' },
  { id: 'JOB004', title: 'Content Marketing Manager', department: 'Marketing', type: 'Full-time', location: 'London', salary: '£40,000 - £55,000', status: 'closed', applicants: 45, posted: '2026-04-15', closing: '2026-05-30' },
  { id: 'JOB005', title: 'Data Analyst Intern', department: 'Finance', type: 'Internship', location: 'London', salary: '£25,000', status: 'active', applicants: 56, posted: '2026-06-01', closing: '2026-06-30' },
];

export const CANDIDATES = [
  { id: 'CND001', name: 'Alex Thompson', job: 'Senior React Developer', stage: 'technical-interview', rating: 4.5, appliedDate: '2026-05-22', email: 'alex@email.com' },
  { id: 'CND002', name: 'Sarah Chen', job: 'Senior React Developer', stage: 'hr-interview', rating: 4.2, appliedDate: '2026-05-24', email: 'sarah@email.com' },
  { id: 'CND003', name: 'James Wilson', job: 'UI/UX Designer', stage: 'screening', rating: 3.8, appliedDate: '2026-05-28', email: 'james@email.com' },
  { id: 'CND004', name: 'Emily Davis', job: 'DevOps Engineer', stage: 'offer', rating: 4.7, appliedDate: '2026-06-02', email: 'emily@email.com' },
  { id: 'CND005', name: 'Michael Brown', job: 'Senior React Developer', stage: 'rejected', rating: 2.5, appliedDate: '2026-05-21', email: 'michael@email.com' },
  { id: 'CND006', name: 'Lisa Garcia', job: 'Data Analyst Intern', stage: 'screening', rating: 3.5, appliedDate: '2026-06-03', email: 'lisa@email.com' },
];

// ==================== DOCUMENTS ====================
export const DOCUMENTS = [
  { id: 'DOC001', name: 'Employee Handbook 2026', category: 'Company Policy', size: '2.4 MB', type: 'pdf', uploadedBy: 'Priya Sharma', uploadDate: '2026-01-05', downloads: 145 },
  { id: 'DOC002', name: 'Leave Policy', category: 'Company Policy', size: '580 KB', type: 'pdf', uploadedBy: 'Priya Sharma', uploadDate: '2026-01-10', downloads: 89 },
  { id: 'DOC003', name: 'Code of Conduct', category: 'Company Policy', size: '1.1 MB', type: 'pdf', uploadedBy: 'Priya Sharma', uploadDate: '2026-01-05', downloads: 112 },
  { id: 'DOC004', name: 'IT Security Guidelines', category: 'IT Policy', size: '890 KB', type: 'pdf', uploadedBy: 'Rajesh Kumar', uploadDate: '2026-02-15', downloads: 67 },
  { id: 'DOC005', name: 'Offer Letter - Ananya Patel', category: 'Employment', size: '320 KB', type: 'pdf', uploadedBy: 'Priya Sharma', uploadDate: '2022-07-20', downloads: 3 },
  { id: 'DOC006', name: 'Appraisal Letter - H2 2025', category: 'Employment', size: '280 KB', type: 'pdf', uploadedBy: 'Priya Sharma', uploadDate: '2026-01-20', downloads: 2 },
  { id: 'DOC007', name: 'Remote Work Policy', category: 'Company Policy', size: '450 KB', type: 'pdf', uploadedBy: 'Priya Sharma', uploadDate: '2026-03-01', downloads: 98 },
  { id: 'DOC008', name: 'Travel Expense Policy', category: 'Finance Policy', size: '620 KB', type: 'pdf', uploadedBy: 'Amit Joshi', uploadDate: '2026-01-12', downloads: 54 },
];

// ==================== AUDIT LOGS ====================
export const AUDIT_LOGS = [
  { id: 'AUD001', action: 'User Login', user: 'Rajesh Kumar', timestamp: '2026-06-07T09:00:00', ip: '192.168.1.100', details: 'Successful login from Chrome/Windows' },
  { id: 'AUD002', action: 'Leave Approved', user: 'Arjun Mehta', timestamp: '2026-06-07T09:30:00', ip: '192.168.1.105', details: 'Approved leave LV002 for Rohit Verma' },
  { id: 'AUD003', action: 'Profile Updated', user: 'Ananya Patel', timestamp: '2026-06-06T14:20:00', ip: '10.0.0.52', details: 'Updated phone number and emergency contact' },
  { id: 'AUD004', action: 'Document Uploaded', user: 'Priya Sharma', timestamp: '2026-06-06T11:00:00', ip: '192.168.1.102', details: 'Uploaded Employee Handbook 2026' },
  { id: 'AUD005', action: 'Role Changed', user: 'Rajesh Kumar', timestamp: '2026-06-05T16:45:00', ip: '192.168.1.100', details: 'Changed role of Lakshmi Venkat from Employee to HR Executive' },
  { id: 'AUD006', action: 'Password Reset', user: 'System', timestamp: '2026-06-05T10:30:00', ip: 'system', details: 'Password reset link sent to deepa@tia.com' },
  { id: 'AUD007', action: 'Expense Rejected', user: 'Arjun Mehta', timestamp: '2026-06-04T15:00:00', ip: '192.168.1.105', details: 'Rejected expense EXP005 - No receipt' },
  { id: 'AUD008', action: 'New Employee Added', user: 'Priya Sharma', timestamp: '2026-06-01T09:15:00', ip: '192.168.1.102', details: 'Added new employee: Sneha Kulkarni - Sales' },
];

// ==================== LOCALSTORAGE HELPERS ====================
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`tia_emp_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`tia_emp_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  remove: (key) => {
    localStorage.removeItem(`tia_emp_${key}`);
  },
  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('tia_emp_'))
      .forEach(key => localStorage.removeItem(key));
  },
};
