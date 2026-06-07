import { useState, useEffect } from 'react';
import { TrendingUp, Target, Star, Award, ChevronRight, BarChart3, CheckCircle, AlertCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import * as ds from '../../services/dataService';

const STATUS_COLORS = { 'on-track': '#22c55e', 'ahead': '#4f46e5', 'at-risk': '#f59e0b', 'behind': '#ef4444' };

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState('goals');
  const [perfData, setPerfData] = useState(null);

  useEffect(() => { ds.getPerformanceData().then(d => setPerfData(d)); }, []);

  if (!perfData) return <div className="page animate-fadeIn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}><div style={{ color: 'var(--text-tertiary)' }}>Loading...</div></div>;

  const { goals, kpis, reviews } = perfData;
  const overallScore = kpis.reduce((a, b) => a + b.score, 0) / kpis.length;

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Performance</h1><p className="page-subtitle">Track goals, KPIs, and performance reviews</p></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="glass-card-static" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={20} style={{ color: 'var(--color-primary-light)' }} />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Overall Score</div>
              <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{overallScore.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: '24px' }}>
        {['goals', 'kpis', 'reviews', 'self-assessment'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {activeTab === 'goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {goals.map(goal => (
            <div key={goal.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{goal.title}</h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="chip chip-primary" style={{ fontSize: '10px' }}>{goal.category}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Weight: {goal.weight}%</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Due: {new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <span className="badge" style={{ background: `${STATUS_COLORS[goal.status]}18`, color: STATUS_COLORS[goal.status] }}>
                  {goal.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${goal.progress}%`, background: STATUS_COLORS[goal.status] }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: STATUS_COLORS[goal.status], minWidth: '40px' }}>{goal.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'kpis' && (
        <div className="page-grid grid-cols-3" style={{ gap: '16px' }}>
          {kpis.map((kpi, i) => (
            <div key={i} className="stats-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div className="stats-label" style={{ marginTop: 0 }}>{kpi.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: kpi.trend === 'up' ? 'var(--color-success)' : kpi.trend === 'down' ? 'var(--color-danger)' : 'var(--text-tertiary)' }}>
                  {kpi.trend === 'up' ? <ArrowUp size={12} /> : kpi.trend === 'down' ? <ArrowDown size={12} /> : <Minus size={12} />}
                  {kpi.trend}
                </div>
              </div>
              <div className="stats-value" style={{ marginBottom: '8px' }}>{kpi.score}<span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>/{kpi.target}</span></div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(kpi.score / 100) * 100}%`, background: kpi.score >= kpi.target ? 'var(--color-success)' : 'var(--color-warning)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((review, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{review.period} Review</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Reviewed by {review.reviewer} · {new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={16} fill={s <= Math.round(review.rating) ? '#f59e0b' : 'none'} style={{ color: s <= Math.round(review.rating) ? '#f59e0b' : 'var(--text-muted)' }} />
                  ))}
                  <span style={{ fontSize: '14px', fontWeight: 700, marginLeft: '4px' }}>{review.rating}</span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{review.summary}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'self-assessment' && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '20px' }}>Self Assessment - H1 2026</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Key Achievements', 'Areas of Improvement', 'Training Needs', 'Career Goals'].map((section, i) => (
              <div key={i} className="form-group">
                <label className="form-label">{section}</label>
                <textarea className="form-input form-textarea" placeholder={`Describe your ${section.toLowerCase()}...`} style={{ minHeight: '80px' }} />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-secondary">Save Draft</button>
              <button className="btn btn-primary">Submit Assessment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


