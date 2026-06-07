import { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Briefcase, Package, Download } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler } from 'chart.js';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#a0a0b4', font: { size: 11 } } } },
  scales: {
    x: { ticks: { color: '#6b6b80', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#6b6b80', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

export default function AnalyticsPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('attendance');
  const TABS = ['attendance', 'leave', 'performance', 'payroll', 'recruitment', 'projects'];

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      { label: 'Present', data: [142, 138, 145, 140, 137, 45], backgroundColor: 'rgba(79,70,229,0.7)', borderRadius: 6 },
      { label: 'Late', data: [5, 8, 3, 7, 10, 2], backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6 },
      { label: 'Absent', data: [3, 4, 2, 3, 3, 0], backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 6 },
    ],
  };

  const leaveData = {
    labels: ['Casual', 'Sick', 'Earned', 'Comp Off', 'Maternity', 'Bereavement'],
    datasets: [{ data: [35, 18, 42, 8, 2, 1], backgroundColor: ['#4f46e5', '#ef4444', '#22c55e', '#f59e0b', '#ec4899', '#6b7280'], borderWidth: 0 }],
  };

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Avg Score', data: [78, 82, 80, 85, 88, 87], borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)', fill: true, tension: 0.4 },
      { label: 'Target', data: [85, 85, 85, 85, 85, 85], borderColor: '#ef4444', borderDash: [5, 5], fill: false, pointRadius: 0 },
    ],
  };

  const payrollData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Total Payroll (₹L)', data: [48, 48, 49, 49, 50, 50], backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 6 },
      { label: 'Deductions (₹L)', data: [9, 9, 9.2, 9.2, 9.5, 9.5], backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 6 },
    ],
  };

  const recruitmentData = {
    labels: ['Applied', 'Screened', 'Interviewed', 'Offered', 'Hired'],
    datasets: [{ data: [175, 92, 45, 12, 8], backgroundColor: ['#4f46e5', '#3b82f6', '#f59e0b', '#22c55e', '#14b8a6'], borderWidth: 0 }],
  };

  const radarData = {
    labels: ['Code Quality', 'Task Completion', 'Punctuality', 'Collaboration', 'Innovation', 'Communication'],
    datasets: [{
      label: 'Team Average', data: [92, 87, 95, 88, 78, 90],
      backgroundColor: 'rgba(79,70,229,0.15)', borderColor: '#4f46e5', pointBackgroundColor: '#4f46e5',
    }],
  };

  const radarOptions = {
    responsive: true, maintainAspectRatio: false,
    scales: { r: { ticks: { color: '#6b6b80', backdropColor: 'transparent', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#a0a0b4', font: { size: 10 } }, suggestedMin: 0, suggestedMax: 100 } },
    plugins: { legend: { labels: { color: '#a0a0b4' } } },
  };

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Analytics & Reports</h1><p className="page-subtitle">Comprehensive workforce analytics and insights</p></div>
        <button className="btn btn-primary" onClick={() => addToast('Report exported!', 'success')}><Download size={16} /> Export Report</button>
      </div>

      <div className="tabs" style={{ marginBottom: '24px' }}>
        {TABS.map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'attendance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Weekly Attendance</h3>
            <div style={{ height: '300px' }}><Bar data={attendanceData} options={chartOptions} /></div>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Attendance Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[{ label: 'Total Employees', value: '150', color: '#4f46e5' }, { label: 'Present Today', value: '142', color: '#22c55e' }, { label: 'On Leave', value: '5', color: '#f59e0b' }, { label: 'Absent', value: '3', color: '#ef4444' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leave' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Leave Utilization by Type</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={leaveData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#a0a0b4', font: { size: 11 }, padding: 12 } } } }} />
            </div>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Leave Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ label: 'Total Leaves Taken', value: '106' }, { label: 'Pending Requests', value: '8' }, { label: 'Approved This Month', value: '12' }, { label: 'Avg Leave/Employee', value: '4.2' }].map((s, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Performance Trend</h3>
            <div style={{ height: '300px' }}><Line data={performanceData} options={chartOptions} /></div>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>KPI Radar</h3>
            <div style={{ height: '300px' }}><Radar data={radarData} options={radarOptions} /></div>
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Payroll Trend (in Lakhs)</h3>
            <div style={{ height: '300px' }}><Bar data={payrollData} options={chartOptions} /></div>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Payroll Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ label: 'Total Payroll', value: '₹50.0L' }, { label: 'Avg Salary', value: '₹3.33L' }, { label: 'Total Deductions', value: '₹9.5L' }, { label: 'Net Payout', value: '₹40.5L' }].map((s, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Hiring Funnel</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={recruitmentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#a0a0b4', font: { size: 11 }, padding: 12 } } } }} />
            </div>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ label: 'Open Positions', value: '4' }, { label: 'Total Applicants', value: '175' }, { label: 'Avg Time to Hire', value: '28 days' }, { label: 'Offer Acceptance Rate', value: '85%' }].map((s, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Project Status Distribution</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={{
                labels: ['Completed', 'In Progress', 'Planning'],
                datasets: [{ data: [1, 2, 1], backgroundColor: ['#22c55e', '#4f46e5', '#f59e0b'], borderWidth: 0 }],
              }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#a0a0b4', font: { size: 11 }, padding: 12 } } } }} />
            </div>
          </div>
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: '16px' }}>Productivity Metrics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[{ label: 'Active Projects', value: '4' }, { label: 'Total Tasks', value: '42' }, { label: 'Completed Tasks', value: '28' }, { label: 'Sprint Velocity', value: '32 pts' }].map((s, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .page > div:nth-of-type(3) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
