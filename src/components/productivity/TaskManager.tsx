import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import type { TaskItem, PriorityLevel, TaskCategory } from '../../types';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Calendar, 
  Filter, 
  Kanban, 
  List, 
  AlertTriangle,
  X
} from 'lucide-react';

export const TaskManager: React.FC = () => {
  const { tasks, addTask, toggleTaskCompleted, deleteTask } = useAppData();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [dueDate, setDueDate] = useState('2026-09-05T23:59');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [category, setCategory] = useState<TaskCategory>('Assignment');

  const categories = ['All', 'Assignment', 'Exam', 'Project', 'Quiz', 'Personal'];

  const filteredTasks = tasks.filter(t => filterCategory === 'All' || t.category === filterCategory);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      subject,
      dueDate,
      priority,
      category
    });

    setTitle('');
    setShowAddModal(false);
  };

  const getUrgencyBadge = (dateStr: string) => {
    const due = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diffHours = (due - now) / (1000 * 3600);

    if (diffHours < 0) return { label: 'Overdue', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
    if (diffHours < 24) return { label: 'Due Today', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    if (diffHours < 48) return { label: 'Tomorrow', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    return { label: 'Upcoming', color: 'bg-slate-800 text-slate-400 border-slate-700' };
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900 border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">Tasks & Deadline Reminders</h1>
              <p className="text-xs text-slate-400">Manage academic assignments, exams, and project deadlines with urgency flags.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition ${viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Kanban Board"
              >
                <Kanban className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-400 mr-1">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border transition ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pending Tasks Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Pending Tasks ({filteredTasks.filter(t => !t.completed).length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {filteredTasks.filter(t => !t.completed).map((t) => {
                const urgency = getUrgencyBadge(t.dueDate);
                return (
                  <div key={t.id} className="glass-card p-5 space-y-3 hover:border-indigo-500/40 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgency.color}`}>
                          {urgency.label}
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                          {t.category}
                        </span>
                      </div>

                      <button onClick={() => deleteTask(t.id)} className="text-slate-500 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{t.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t.subject} • Due {new Date(t.dueDate).toLocaleString()}</p>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => toggleTaskCompleted(t.id)}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Completed ({filteredTasks.filter(t => t.completed).length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {filteredTasks.filter(t => t.completed).map((t) => (
                <div key={t.id} className="glass-card p-4 flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleTaskCompleted(t.id)} className="text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-slate-900" />
                    </button>
                    <div>
                      <p className="text-xs font-bold text-slate-400 line-through">{t.title}</p>
                      <p className="text-[10px] text-slate-500">{t.subject}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteTask(t.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="glass-card p-6 space-y-3">
          {filteredTasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTaskCompleted(t.id)}>
                  <CheckCircle2 className={`w-5 h-5 ${t.completed ? 'text-emerald-400 fill-emerald-500' : 'text-slate-500'}`} />
                </button>
                <div>
                  <p className={`text-xs font-bold ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{t.title}</p>
                  <p className="text-[10px] text-slate-400">{t.subject} • Due {new Date(t.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300">
                  {t.category}
                </span>
                <button onClick={() => deleteTask(t.id)} className="text-slate-500 hover:text-rose-400 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Add New Task</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject name..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Due Date & Time</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  >
                    {['Assignment', 'Exam', 'Project', 'Quiz', 'Personal'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
