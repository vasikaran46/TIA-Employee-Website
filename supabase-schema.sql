-- ============================================================
-- TIA Software Solutions — Employee Management Portal
-- Supabase Database Schema
-- Run this in your Supabase SQL Editor (supabase.com > SQL Editor)
-- ============================================================

-- ==================== PROFILES ====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'hr', 'manager', 'employee')),
  designation TEXT,
  department TEXT,
  phone TEXT,
  join_date DATE,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  marital_status TEXT,
  nationality TEXT,
  blood_group TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  emergency_name TEXT,
  emergency_relation TEXT,
  emergency_phone TEXT,
  emergency_address TEXT,
  bank_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  pan_number TEXT,
  uan_number TEXT,
  manager_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on-leave', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== DEPARTMENTS ====================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  head TEXT,
  employee_count INT DEFAULT 0,
  color TEXT DEFAULT '#4f46e5',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ATTENDANCE ====================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent', 'half-day', 'checked-in')),
  worked_hours NUMERIC(4,1),
  is_late BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ==================== LEAVE TYPES ====================
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  total_days INT NOT NULL,
  color TEXT DEFAULT '#4f46e5'
);

-- ==================== LEAVE BALANCES ====================
CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  leave_type_id UUID REFERENCES leave_types(id) ON DELETE CASCADE,
  used INT DEFAULT 0,
  year INT DEFAULT EXTRACT(YEAR FROM NOW()),
  UNIQUE(user_id, leave_type_id, year)
);

-- ==================== LEAVE REQUESTS ====================
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  days INT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES profiles(id),
  reject_reason TEXT,
  applied_on DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== HOLIDAYS ====================
CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'public' CHECK (type IN ('public', 'national', 'optional'))
);

-- ==================== PAYROLL ====================
CREATE TABLE IF NOT EXISTS payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  basic NUMERIC(10,2),
  hra NUMERIC(10,2),
  da NUMERIC(10,2),
  special_allowance NUMERIC(10,2),
  transport_allowance NUMERIC(10,2),
  medical_allowance NUMERIC(10,2),
  gross_salary NUMERIC(10,2),
  pf NUMERIC(10,2),
  professional_tax NUMERIC(10,2),
  income_tax NUMERIC(10,2),
  insurance NUMERIC(10,2),
  total_deductions NUMERIC(10,2),
  net_salary NUMERIC(10,2),
  status TEXT DEFAULT 'processed',
  paid_on DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PROJECTS ====================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold')),
  progress INT DEFAULT 0,
  deadline DATE,
  lead TEXT,
  team UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TASKS ====================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  project_name TEXT,
  assignee TEXT,
  assignee_id UUID REFERENCES profiles(id),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  due_date DATE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TIMESHEET ====================
CREATE TABLE IF NOT EXISTS timesheet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  project TEXT NOT NULL,
  task TEXT,
  hours NUMERIC(4,1) NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== DOCUMENTS ====================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  size TEXT,
  type TEXT DEFAULT 'pdf',
  uploaded_by TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  downloads INT DEFAULT 0,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ANNOUNCEMENTS ====================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author TEXT,
  department TEXT,
  date DATE DEFAULT CURRENT_DATE,
  priority TEXT DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high')),
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TICKETS ====================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'IT Support',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved')),
  created_by TEXT,
  created_by_id UUID REFERENCES profiles(id),
  assigned_to TEXT,
  resolved_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ASSETS ====================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,
  serial_number TEXT,
  assigned_to TEXT,
  assigned_to_id UUID REFERENCES profiles(id),
  assigned_date DATE,
  condition TEXT DEFAULT 'good',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'maintenance', 'retired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== EXPENSES ====================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  amount NUMERIC(10,2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  receipt BOOLEAN DEFAULT false,
  receipt_url TEXT,
  approved_by TEXT,
  rejected_by TEXT,
  reject_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== EVENTS ====================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  type TEXT DEFAULT 'meeting',
  color TEXT DEFAULT '#4f46e5',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== NOTIFICATIONS ====================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'system',
  read BOOLEAN DEFAULT false,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== COURSES ====================
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  instructor TEXT,
  duration TEXT,
  progress INT DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in-progress', 'completed')),
  start_date DATE,
  end_date DATE,
  enrolled INT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== JOB OPENINGS ====================
CREATE TABLE IF NOT EXISTS job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  type TEXT DEFAULT 'Full-time',
  location TEXT,
  salary TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  applicants INT DEFAULT 0,
  posted DATE DEFAULT CURRENT_DATE,
  closing DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== CANDIDATES ====================
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  job TEXT,
  stage TEXT DEFAULT 'screening',
  rating NUMERIC(2,1) DEFAULT 0,
  applied_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PERFORMANCE GOALS ====================
CREATE TABLE IF NOT EXISTS performance_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  progress INT DEFAULT 0,
  status TEXT DEFAULT 'on-track',
  due_date DATE,
  weight INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PERFORMANCE REVIEWS ====================
CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  period TEXT,
  rating NUMERIC(2,1),
  reviewer TEXT,
  review_date DATE,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== AUDIT LOGS ====================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  user_name TEXT,
  user_id UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip TEXT,
  details TEXT
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheet_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

-- Departments: all authenticated can read
CREATE POLICY "departments_select" ON departments FOR SELECT USING (true);
CREATE POLICY "departments_manage" ON departments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

-- Attendance: users see own, managers/admin see all
CREATE POLICY "attendance_select" ON attendance FOR SELECT USING (true);
CREATE POLICY "attendance_insert" ON attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "attendance_update" ON attendance FOR UPDATE USING (auth.uid() = user_id);

-- Leave types: all can read
CREATE POLICY "leave_types_select" ON leave_types FOR SELECT USING (true);
CREATE POLICY "leave_types_manage" ON leave_types FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

-- Leave balances: users see own
CREATE POLICY "leave_balances_select" ON leave_balances FOR SELECT USING (true);
CREATE POLICY "leave_balances_manage" ON leave_balances FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

-- Leave requests: all can read, users insert own
CREATE POLICY "leave_requests_select" ON leave_requests FOR SELECT USING (true);
CREATE POLICY "leave_requests_insert" ON leave_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "leave_requests_update" ON leave_requests FOR UPDATE USING (true);

-- Read-only tables for all authenticated users
CREATE POLICY "holidays_select" ON holidays FOR SELECT USING (true);
CREATE POLICY "holidays_manage" ON holidays FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

CREATE POLICY "payroll_select" ON payroll FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));
CREATE POLICY "payroll_manage" ON payroll FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

CREATE POLICY "projects_select" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_manage" ON projects FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')));

CREATE POLICY "tasks_select" ON tasks FOR SELECT USING (true);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE USING (true);

CREATE POLICY "timesheet_select" ON timesheet_entries FOR SELECT USING (true);
CREATE POLICY "timesheet_insert" ON timesheet_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "timesheet_update" ON timesheet_entries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "documents_select" ON documents FOR SELECT USING (true);
CREATE POLICY "documents_manage" ON documents FOR ALL USING (true);

CREATE POLICY "announcements_select" ON announcements FOR SELECT USING (true);
CREATE POLICY "announcements_manage" ON announcements FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr', 'manager')));

CREATE POLICY "tickets_select" ON tickets FOR SELECT USING (true);
CREATE POLICY "tickets_insert" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "tickets_update" ON tickets FOR UPDATE USING (true);

CREATE POLICY "assets_select" ON assets FOR SELECT USING (true);
CREATE POLICY "assets_manage" ON assets FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin')));

CREATE POLICY "expenses_select" ON expenses FOR SELECT USING (true);
CREATE POLICY "expenses_insert" ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "expenses_update" ON expenses FOR UPDATE USING (true);

CREATE POLICY "events_select" ON events FOR SELECT USING (true);
CREATE POLICY "events_manage" ON events FOR ALL USING (true);

CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "courses_select" ON courses FOR SELECT USING (true);
CREATE POLICY "courses_manage" ON courses FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

CREATE POLICY "job_openings_select" ON job_openings FOR SELECT USING (true);
CREATE POLICY "job_openings_manage" ON job_openings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

CREATE POLICY "candidates_select" ON candidates FOR SELECT USING (true);
CREATE POLICY "candidates_manage" ON candidates FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr')));

CREATE POLICY "performance_goals_select" ON performance_goals FOR SELECT USING (true);
CREATE POLICY "performance_goals_manage" ON performance_goals FOR ALL USING (true);

CREATE POLICY "performance_reviews_select" ON performance_reviews FOR SELECT USING (true);
CREATE POLICY "performance_reviews_manage" ON performance_reviews FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr', 'manager')));

CREATE POLICY "audit_logs_select" ON audit_logs FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "audit_logs_insert" ON audit_logs FOR INSERT WITH CHECK (true);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (TRIGGER)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED DATA (Demo data matching the mock data)
-- ============================================================

-- Departments
INSERT INTO departments (name, head, employee_count, color) VALUES
  ('Engineering', 'Arjun Mehta', 45, '#4f46e5'),
  ('Human Resources', 'Priya Sharma', 12, '#ac40f2'),
  ('Marketing', 'Vikram Singh', 18, '#f59e0b'),
  ('Sales', 'Neha Gupta', 25, '#22c55e'),
  ('Finance', 'Amit Joshi', 10, '#3b82f6'),
  ('Design', 'Kavitha Reddy', 15, '#ec4899'),
  ('Operations', 'Suresh Nair', 8, '#14b8a6'),
  ('IT', 'Rajesh Kumar', 20, '#f97316')
ON CONFLICT (name) DO NOTHING;

-- Leave Types
INSERT INTO leave_types (name, total_days, color) VALUES
  ('Casual Leave', 12, '#4f46e5'),
  ('Sick Leave', 10, '#ef4444'),
  ('Earned Leave', 15, '#22c55e'),
  ('Compensatory Off', 5, '#f59e0b'),
  ('Maternity/Paternity', 180, '#ec4899'),
  ('Bereavement', 5, '#6b7280')
ON CONFLICT DO NOTHING;

-- Holidays
INSERT INTO holidays (date, name, type) VALUES
  ('2026-01-01', 'New Year', 'public'),
  ('2026-01-26', 'Republic Day', 'national'),
  ('2026-03-14', 'Holi', 'public'),
  ('2026-04-02', 'Good Friday', 'public'),
  ('2026-04-14', 'Dr. Ambedkar Jayanti', 'national'),
  ('2026-05-01', 'May Day', 'public'),
  ('2026-06-17', 'Eid ul-Fitr', 'public'),
  ('2026-07-06', 'Rath Yatra', 'optional'),
  ('2026-08-15', 'Independence Day', 'national'),
  ('2026-09-02', 'Ganesh Chaturthi', 'public'),
  ('2026-10-02', 'Gandhi Jayanti', 'national'),
  ('2026-10-20', 'Dussehra', 'public'),
  ('2026-11-09', 'Diwali', 'public'),
  ('2026-12-25', 'Christmas', 'public')
ON CONFLICT DO NOTHING;

-- Announcements
INSERT INTO announcements (title, content, author, department, date, priority, pinned) VALUES
  ('Annual Performance Review Cycle Starts June 15', 'All managers are requested to complete their team assessments by June 30. Please ensure all KPIs are updated in the system before the review meetings.', 'Priya Sharma', 'HR', '2026-06-06', 'high', true),
  ('Office Renovation - 3rd Floor', 'The 3rd floor will be under renovation from June 10 to June 25. Teams stationed there will temporarily relocate to the 5th floor conference area.', 'Suresh Nair', 'Operations', '2026-06-05', 'medium', true),
  ('New Employee Health Insurance Plan', 'We are upgrading our health insurance coverage. New plan includes dental and vision coverage. Details will be shared via email.', 'Priya Sharma', 'HR', '2026-06-04', 'high', false),
  ('TIA Wins Best Digital Agency Award', 'Congratulations to the entire team! TIA Software Solutions has been awarded Best Digital Agency at the London Tech Awards 2026.', 'Rajesh Kumar', 'Management', '2026-06-02', 'low', false),
  ('Quarterly Town Hall - June 28', 'Join us for the Q2 town hall meeting. Topics include company performance, upcoming projects, and team celebrations.', 'Rajesh Kumar', 'Management', '2026-06-01', 'medium', false)
ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO projects (name, status, progress, deadline, lead) VALUES
  ('TIA Portal Redesign', 'in-progress', 65, '2026-07-30', 'Arjun Mehta'),
  ('Mobile App V2', 'in-progress', 40, '2026-08-15', 'Rohit Verma'),
  ('Cloud Migration', 'planning', 15, '2026-09-30', 'Sanjay Rao'),
  ('Brand Refresh Campaign', 'completed', 100, '2026-05-31', 'Vikram Singh')
ON CONFLICT DO NOTHING;

-- Tasks
INSERT INTO tasks (title, description, project_name, assignee, priority, status, due_date, tags) VALUES
  ('Design new dashboard UI', 'Create wireframes and mockups for the new employee dashboard', 'TIA Portal Redesign', 'Meera Iyer', 'high', 'in-progress', '2026-06-15', ARRAY['design', 'ui']),
  ('Implement auth module', 'Set up JWT auth with role-based access', 'TIA Portal Redesign', 'Ananya Patel', 'critical', 'done', '2026-06-08', ARRAY['backend', 'security']),
  ('API integration - Leave module', 'Connect frontend leave forms with REST API', 'TIA Portal Redesign', 'Karthik Sundaram', 'medium', 'todo', '2026-06-20', ARRAY['frontend', 'api']),
  ('Setup CI/CD pipeline', 'Configure GitHub Actions for automated deployment', 'Cloud Migration', 'Sanjay Rao', 'high', 'in-progress', '2026-06-18', ARRAY['devops']),
  ('Performance testing', 'Load testing with 1000 concurrent users', 'Mobile App V2', 'Rohit Verma', 'medium', 'review', '2026-06-12', ARRAY['testing']),
  ('Database schema optimization', 'Optimize queries and add proper indexes', 'TIA Portal Redesign', 'Arjun Mehta', 'high', 'todo', '2026-06-22', ARRAY['database']),
  ('Mobile responsive fixes', 'Fix layout issues on tablet and mobile devices', 'Mobile App V2', 'Karthik Sundaram', 'high', 'in-progress', '2026-06-14', ARRAY['frontend', 'mobile']),
  ('Security audit', 'Complete security assessment before migration', 'Cloud Migration', 'Rajesh Kumar', 'critical', 'todo', '2026-06-25', ARRAY['security'])
ON CONFLICT DO NOTHING;

-- Documents
INSERT INTO documents (name, category, size, type, uploaded_by, upload_date, downloads) VALUES
  ('Employee Handbook 2026', 'Company Policy', '2.4 MB', 'pdf', 'Priya Sharma', '2026-01-05', 145),
  ('Leave Policy', 'Company Policy', '580 KB', 'pdf', 'Priya Sharma', '2026-01-10', 89),
  ('Code of Conduct', 'Company Policy', '1.1 MB', 'pdf', 'Priya Sharma', '2026-01-05', 112),
  ('IT Security Guidelines', 'IT Policy', '890 KB', 'pdf', 'Rajesh Kumar', '2026-02-15', 67),
  ('Remote Work Policy', 'Company Policy', '450 KB', 'pdf', 'Priya Sharma', '2026-03-01', 98),
  ('Travel Expense Policy', 'Finance Policy', '620 KB', 'pdf', 'Amit Joshi', '2026-01-12', 54)
ON CONFLICT DO NOTHING;

-- Courses
INSERT INTO courses (title, category, instructor, duration, progress, status, start_date, end_date, enrolled, description) VALUES
  ('Advanced React Patterns', 'Technical', 'Arjun Mehta', '16 hours', 65, 'in-progress', '2026-05-01', '2026-06-30', 24, 'Deep dive into hooks, patterns, and performance optimization'),
  ('AWS Cloud Practitioner', 'Cloud', 'External', '40 hours', 30, 'in-progress', '2026-04-15', '2026-07-15', 15, 'AWS fundamentals and certification prep'),
  ('Leadership Essentials', 'Soft Skills', 'Priya Sharma', '8 hours', 100, 'completed', '2026-03-01', '2026-04-15', 30, 'Essential management and leadership skills'),
  ('Cybersecurity Fundamentals', 'Security', 'Rajesh Kumar', '12 hours', 0, 'upcoming', '2026-07-01', '2026-08-15', 8, 'Security best practices and threat prevention'),
  ('UI/UX Design Principles', 'Design', 'Kavitha Reddy', '20 hours', 85, 'in-progress', '2026-04-01', '2026-06-15', 18, 'Modern design thinking and user experience'),
  ('Data Analytics with Python', 'Technical', 'External', '32 hours', 0, 'upcoming', '2026-08-01', '2026-10-01', 0, 'Python for data analysis and ML basics')
ON CONFLICT DO NOTHING;

-- Job Openings
INSERT INTO job_openings (title, department, type, location, salary, status, applicants, posted, closing) VALUES
  ('Senior React Developer', 'Engineering', 'Full-time', 'London / Remote', '£65,000 - £85,000', 'active', 34, '2026-05-20', '2026-06-30'),
  ('UI/UX Designer', 'Design', 'Full-time', 'London', '£45,000 - £60,000', 'active', 22, '2026-05-25', '2026-07-10'),
  ('DevOps Engineer', 'IT', 'Full-time', 'Remote', '£70,000 - £90,000', 'active', 18, '2026-06-01', '2026-07-15'),
  ('Content Marketing Manager', 'Marketing', 'Full-time', 'London', '£40,000 - £55,000', 'closed', 45, '2026-04-15', '2026-05-30'),
  ('Data Analyst Intern', 'Finance', 'Internship', 'London', '£25,000', 'active', 56, '2026-06-01', '2026-06-30')
ON CONFLICT DO NOTHING;

-- Candidates
INSERT INTO candidates (name, email, job, stage, rating, applied_date) VALUES
  ('Alex Thompson', 'alex@email.com', 'Senior React Developer', 'technical-interview', 4.5, '2026-05-22'),
  ('Sarah Chen', 'sarah@email.com', 'Senior React Developer', 'hr-interview', 4.2, '2026-05-24'),
  ('James Wilson', 'james@email.com', 'UI/UX Designer', 'screening', 3.8, '2026-05-28'),
  ('Emily Davis', 'emily@email.com', 'DevOps Engineer', 'offer', 4.7, '2026-06-02'),
  ('Michael Brown', 'michael@email.com', 'Senior React Developer', 'rejected', 2.5, '2026-05-21'),
  ('Lisa Garcia', 'lisa@email.com', 'Data Analyst Intern', 'screening', 3.5, '2026-06-03')
ON CONFLICT DO NOTHING;

-- Events
INSERT INTO events (title, date, time, type, color, description) VALUES
  ('Q2 Town Hall', '2026-06-28', '15:00', 'meeting', '#4f46e5', 'Quarterly company-wide meeting'),
  ('Sprint Planning', '2026-06-09', '10:00', 'meeting', '#3b82f6', 'Sprint 24 planning session'),
  ('Team Building Day', '2026-07-05', '09:00', 'event', '#22c55e', 'Annual team building activity'),
  ('Project Review', '2026-06-12', '14:00', 'meeting', '#f59e0b', 'TIA Portal milestone review'),
  ('Training: React Advanced', '2026-06-18', '11:00', 'training', '#ac40f2', 'Advanced React patterns workshop')
ON CONFLICT DO NOTHING;

-- Assets
INSERT INTO assets (name, type, serial_number, assigned_to, assigned_date, condition, status) VALUES
  ('MacBook Pro 16"', 'Laptop', 'MBP-2026-001', 'Ananya Patel', '2022-08-01', 'good', 'assigned'),
  ('Dell UltraSharp 27"', 'Monitor', 'DU27-2023-012', 'Ananya Patel', '2022-08-01', 'good', 'assigned'),
  ('Herman Miller Aeron', 'Chair', 'HMA-2021-045', 'Ananya Patel', '2022-08-01', 'good', 'assigned'),
  ('iPhone 15 Pro', 'Phone', 'IP15-2025-008', 'Arjun Mehta', '2025-10-15', 'excellent', 'assigned'),
  ('ThinkPad X1 Carbon', 'Laptop', 'TP-2024-022', NULL, NULL, 'good', 'available'),
  ('Logitech MX Keys', 'Keyboard', 'LMX-2025-033', 'Rohit Verma', '2025-06-10', 'good', 'assigned')
ON CONFLICT DO NOTHING;

-- Audit Logs
INSERT INTO audit_logs (action, user_name, timestamp, ip, details) VALUES
  ('User Login', 'Rajesh Kumar', '2026-06-07T09:00:00Z', '192.168.1.100', 'Successful login from Chrome/Windows'),
  ('Leave Approved', 'Arjun Mehta', '2026-06-07T09:30:00Z', '192.168.1.105', 'Approved leave LV002 for Rohit Verma'),
  ('Profile Updated', 'Ananya Patel', '2026-06-06T14:20:00Z', '10.0.0.52', 'Updated phone number and emergency contact'),
  ('Document Uploaded', 'Priya Sharma', '2026-06-06T11:00:00Z', '192.168.1.102', 'Uploaded Employee Handbook 2026'),
  ('Role Changed', 'Rajesh Kumar', '2026-06-05T16:45:00Z', '192.168.1.100', 'Changed role of Lakshmi Venkat from Employee to HR Executive'),
  ('Password Reset', 'System', '2026-06-05T10:30:00Z', 'system', 'Password reset link sent to deepa@tia.com')
ON CONFLICT DO NOTHING;
