import { useState, useEffect } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Plus, Clock, Gift, Star, Briefcase } from 'lucide-react';
import * as ds from '../../services/dataService';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const EVENT_TYPE_ICONS = { meeting: Clock, birthday: Gift, holiday: Star, event: Briefcase, training: Briefcase, anniversary: Gift };

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  const [fetchedEvents, setFetchedEvents] = useState([]);
  const [fetchedHolidays, setFetchedHolidays] = useState([]);

  useEffect(() => {
    Promise.all([ds.getEvents(), ds.getHolidays()]).then(([e, h]) => { setFetchedEvents(e); setFetchedHolidays(h); });
  }, []);

  const allEvents = [...fetchedEvents, ...fetchedHolidays.map(h => ({ id: h.date, title: h.name, date: h.date, type: 'holiday', color: '#14b8a6' }))];

  const getDayEvents = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents.filter(e => e.date === dateStr);
  };

  const calendarDays = [];
  for (let i = firstDay - 1; i >= 0; i--) calendarDays.push({ day: daysInPrevMonth - i, isOtherMonth: true });
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push({ day: i, isOtherMonth: false });
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) calendarDays.push({ day: i, isOtherMonth: true });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const upcomingEvents = allEvents.filter(e => new Date(e.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 8);

  return (
    <div className="page animate-fadeIn">
      <div className="page-header">
        <div><h1 className="page-title">Calendar</h1><p className="page-subtitle">Company events, holidays, meetings, and celebrations</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Calendar Grid */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button className="btn btn-ghost btn-icon" onClick={prevMonth}><ChevronLeft size={18} /></button>
            <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{MONTHS[month]} {year}</h3>
            <button className="btn btn-ghost btn-icon" onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>
          <div className="calendar-grid">
            {DAYS.map(d => <div key={d} className="calendar-header-cell">{d}</div>)}
            {calendarDays.map((item, i) => {
              const isToday = !item.isOtherMonth && item.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const events = item.isOtherMonth ? [] : getDayEvents(item.day);
              return (
                <div key={i} className={`calendar-cell ${isToday ? 'today' : ''} ${item.isOtherMonth ? 'other-month' : ''}`}
                  onClick={() => !item.isOtherMonth && setSelectedDate(item.day)}>
                  <div className="calendar-day">{item.day}</div>
                  {events.slice(0, 2).map((e, j) => (
                    <div key={j} className="calendar-event" style={{ background: `${e.color || '#4f46e5'}20`, color: e.color || '#4f46e5' }}>
                      {e.title}
                    </div>
                  ))}
                  {events.length > 2 && <div style={{ fontSize: '9px', color: 'var(--text-muted)', padding: '0 6px' }}>+{events.length - 2} more</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalIcon size={18} style={{ color: 'var(--color-primary-light)' }} />
            Upcoming Events
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingEvents.map(event => {
              const Icon = EVENT_TYPE_ICONS[event.type] || CalIcon;
              return (
                <div key={event.id} style={{
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: `3px solid ${event.color || '#4f46e5'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Icon size={12} style={{ color: event.color || '#4f46e5' }} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{event.title}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    {event.time && ` · ${event.time}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .page > div:last-of-type { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}


