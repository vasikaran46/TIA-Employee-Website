import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ListTodo, Plus, Filter, LayoutGrid, List, ChevronRight, Calendar, User, X, Send } from 'lucide-react';
import * as ds from '../../services/dataService';

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#6b7280' },
  { id: 'in-progress', label: 'In Progress', color: '#4f46e5' },
  { id: 'review', label: 'Review', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#22c55e' },
];

const PRIORITY_COLORS = {
  critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#6b7280',
};

export default function TasksPage() {
  const { addToast } = useApp();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [viewMode, setViewMode] = useState('kanban');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterProject, setFilterProject] = useState('all');
  const [newTask, setNewTask] = useState({ title: '', project: '', priority: 'medium', assignee: '', dueDate: '', description: '' });

  useEffect(() => {
    Promise.all([ds.getTasks(), ds.getProjects()]).then(([t, p]) => { setTasks(t); setProjects(p); });
  }, []);

  const filteredTasks = filterProject === 'all' ? tasks : tasks.filter(t => t.project === filterProject);

  const handleAddTask = () => {
    if (!newTask.title || !newTask.project) { addToast('Please fill required fields', 'error'); return; }
    const task = { ...newTask, id: `TSK${String(tasks.length + 1).padStart(3, '0')}`, status: 'todo', tags: [] };
    setTasks([task, ...tasks]);
    setShowAddModal(false);
    setNewTask({ title: '', project: '', priority: 'medium', assignee: '', dueDate: '', description: '' });
    addToast('Task created!', 'success');
  };

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks & projects</h1>
          <p className="page-subtitle">Manage tasks, projects, and team collaboration</p>
        </div>
        <div className="page-actions">
          <select className="form-select" style={{ width: '180px', padding: '8px 12px', fontSize: '13px' }}
            value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
            <option value="all">All projects</option>
            {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <button className={`btn btn-ghost btn-sm`} style={{ borderRadius: 0, background: viewMode === 'kanban' ? 'var(--bg-active)' : 'transparent' }}
              onClick={() => setViewMode('kanban')}><LayoutGrid size={16} /></button>
            <button className={`btn btn-ghost btn-sm`} style={{ borderRadius: 0, background: viewMode === 'list' ? 'var(--bg-active)' : 'transparent' }}
              onClick={() => setViewMode('list')}><List size={16} /></button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Task</button>
        </div>
      </div>

      {/* projects Overview */}
      <div className="page-grid grid-cols-4" style={{ marginBottom: '24px' }}>
        {projects.map(project => (
          <div key={project.id} className="glass-card" style={{ padding: '16px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{project.name}</h4>
              <span className={`badge ${project.status === 'completed' ? 'badge-success' : project.status === 'in-progress' ? 'badge-primary' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                {project.status}
              </span>
            </div>
            <div className="progress-bar progress-sm" style={{ marginBottom: '8px' }}>
              <div className="progress-fill" style={{ width: `${project.progress}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)' }}>
              <span>{project.progress}% complete</span>
              <span>Due {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="kanban-column">
                <div className="kanban-column-header">
                  <div className="kanban-column-title">
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                    {col.label}
                  </div>
                  <span className="kanban-column-count">{colTasks.length}</span>
                </div>
                <div className="kanban-cards">
                  {colTasks.map(task => (
                    <div key={task.id} className="kanban-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className="badge" style={{ background: `${PRIORITY_COLORS[task.priority]}18`, color: PRIORITY_COLORS[task.priority], fontSize: '10px' }}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{task.id}</span>
                      </div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', lineHeight: 1.4 }}>{task.title}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '10px', lineHeight: 1.4 }}>{task.description?.substring(0, 80)}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {task.tags?.map(tag => (
                            <span key={tag} className="chip" style={{ fontSize: '9px', padding: '1px 6px' }}>{tag}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--text-tertiary)' }}>
                          <Calendar size={10} />
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div className="avatar avatar-xs" style={{ fontSize: '8px' }}>{task.assignee?.split(' ').map(n => n[0]).join('')}</div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{task.assignee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Priority</th><th>Status</th><th>Due Date</th></tr></thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>{task.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{task.id}</div>
                    </td>
                    <td>{task.project}</td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="avatar avatar-xs" style={{ fontSize: '8px' }}>{task.assignee?.split(' ').map(n => n[0]).join('')}</div>
                      {task.assignee}
                    </div></td>
                    <td><span className="badge" style={{ background: `${PRIORITY_COLORS[task.priority]}18`, color: PRIORITY_COLORS[task.priority] }}>{task.priority}</span></td>
                    <td><span className={`badge ${task.status === 'done' ? 'badge-success' : task.status === 'in-progress' ? 'badge-primary' : task.status === 'review' ? 'badge-warning' : 'badge-neutral'}`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span></td>
                    <td>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Task</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Title <span className="required">*</span></label>
                  <input className="form-input" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Project <span className="required">*</span></label>
                    <select className="form-select" value={newTask.project} onChange={(e) => setNewTask(p => ({ ...p, project: e.target.value }))}>
                      <option value="">Select project</option>
                      {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-select" value={newTask.priority} onChange={(e) => setNewTask(p => ({ ...p, priority: e.target.value }))}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Assignee</label>
                    <input className="form-input" placeholder="Assignee name" value={newTask.assignee} onChange={(e) => setNewTask(p => ({ ...p, assignee: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input type="date" className="form-input" value={newTask.dueDate} onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input form-textarea" placeholder="Task description..." value={newTask.description} onChange={(e) => setNewTask(p => ({ ...p, description: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddTask}><Send size={14} /> Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
