import { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Award, Clock, Users, Play, CheckCircle, Calendar } from 'lucide-react';
import * as ds from '../../services/dataService';

const STATUS_COLORS = { 'in-progress': '#4f46e5', completed: '#22c55e', upcoming: '#f59e0b' };
const CATEGORIES = ['All', 'Technical', 'Cloud', 'Soft Skills', 'Security', 'Design'];

export default function TrainingPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => { ds.getCourses().then(c => setAllCourses(c)); }, []);

  const filtered = activeCategory === 'All' ? allCourses : allCourses.filter(c => c.category === activeCategory);

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Training & Learning</h1><p className="page-subtitle">Explore courses, track certifications, and grow your skills</p></div>
      </div>

      {/* Stats */}
      <div className="page-grid grid-cols-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Enrolled Courses', value: allCourses.filter(c => c.status === 'in-progress').length, icon: BookOpen, color: '#4f46e5', bg: 'rgba(79,70,229,0.12)' },
          { label: 'Completed', value: allCourses.filter(c => c.status === 'completed').length, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
          { label: 'Upcoming', value: allCourses.filter(c => c.status === 'upcoming').length, icon: Calendar, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
          { label: 'Total Hours', value: allCourses.filter(c => c.status !== 'upcoming').reduce((a, c) => a + parseInt(c.duration), 0), icon: Clock, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stats-card">
              <div className="stats-icon" style={{ background: s.bg }}><Icon size={22} style={{ color: s.color }} /></div>
              <div className="stats-value">{s.value}</div>
              <div className="stats-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="page-grid grid-cols-3" style={{ gap: '20px' }}>
        {filtered.map(course => (
          <div key={course.id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: STATUS_COLORS[course.status] || '#4f46e5' }} />
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge" style={{ background: `${STATUS_COLORS[course.status]}18`, color: STATUS_COLORS[course.status] }}>
                  {course.status === 'in-progress' ? 'In Progress' : course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
                <span className="chip" style={{ fontSize: '10px' }}>{course.category}</span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', fontFamily: 'var(--font-display)' }}>{course.title}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px', lineHeight: 1.5 }}>{course.description}</p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} /> {course.duration}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={11} /> {course.enrolled} enrolled</span>
                <span>By {course.instructor}</span>
              </div>
              {course.status !== 'upcoming' && (
                <>
                  <div className="progress-bar progress-sm" style={{ marginBottom: '6px' }}>
                    <div className="progress-fill" style={{ width: `${course.progress}%`, background: STATUS_COLORS[course.status] }} />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'right' }}>{course.progress}% complete</div>
                </>
              )}
              <button className={`btn ${course.status === 'upcoming' ? 'btn-secondary' : 'btn-primary'} btn-sm`} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
                {course.status === 'upcoming' ? 'Notify Me' : course.status === 'completed' ? 'View Certificate' : 'Continue Learning'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



