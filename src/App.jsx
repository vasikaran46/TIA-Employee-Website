import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import AttendancePage from './pages/attendance/AttendancePage';
import LeavePage from './pages/leave/LeavePage';
import PayrollPage from './pages/payroll/PayrollPage';
import TasksPage from './pages/tasks/TasksPage';
import TimesheetPage from './pages/timesheet/TimesheetPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import CommunicationPage from './pages/communication/CommunicationPage';
import PerformancePage from './pages/performance/PerformancePage';
import RecruitmentPage from './pages/recruitment/RecruitmentPage';
import TrainingPage from './pages/training/TrainingPage';
import HelpdeskPage from './pages/helpdesk/HelpdeskPage';
import AssetsPage from './pages/assets/AssetsPage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import CalendarPage from './pages/calendar/CalendarPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import AdminPage from './pages/admin/AdminPage';

function ProtectedRoute({ children, module }) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (module && !hasPermission(module)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<ProtectedRoute module="dashboard"><DashboardPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute module="profile"><ProfilePage /></ProtectedRoute>} />
        <Route path="attendance" element={<ProtectedRoute module="attendance"><AttendancePage /></ProtectedRoute>} />
        <Route path="leave" element={<ProtectedRoute module="leave"><LeavePage /></ProtectedRoute>} />
        <Route path="payroll" element={<ProtectedRoute module="payroll"><PayrollPage /></ProtectedRoute>} />
        <Route path="tasks" element={<ProtectedRoute module="tasks"><TasksPage /></ProtectedRoute>} />
        <Route path="timesheet" element={<ProtectedRoute module="timesheet"><TimesheetPage /></ProtectedRoute>} />
        <Route path="documents" element={<ProtectedRoute module="documents"><DocumentsPage /></ProtectedRoute>} />
        <Route path="communication" element={<ProtectedRoute module="communication"><CommunicationPage /></ProtectedRoute>} />
        <Route path="performance" element={<ProtectedRoute module="performance"><PerformancePage /></ProtectedRoute>} />
        <Route path="recruitment" element={<ProtectedRoute module="recruitment"><RecruitmentPage /></ProtectedRoute>} />
        <Route path="training" element={<ProtectedRoute module="training"><TrainingPage /></ProtectedRoute>} />
        <Route path="helpdesk" element={<ProtectedRoute module="helpdesk"><HelpdeskPage /></ProtectedRoute>} />
        <Route path="assets" element={<ProtectedRoute module="assets"><AssetsPage /></ProtectedRoute>} />
        <Route path="expenses" element={<ProtectedRoute module="expenses"><ExpensesPage /></ProtectedRoute>} />
        <Route path="calendar" element={<ProtectedRoute module="calendar"><CalendarPage /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute module="notifications"><NotificationsPage /></ProtectedRoute>} />
        <Route path="analytics" element={<ProtectedRoute module="analytics"><AnalyticsPage /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute module="admin"><AdminPage /></ProtectedRoute>} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
