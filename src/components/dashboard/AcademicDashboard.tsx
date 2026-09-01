import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  PieChart, 
  Flame, 
  HelpCircle, 
  Bug, 
  Code2, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const AcademicDashboard: React.FC = () => {
  const { stats, setActiveModule, tasks, attendance, notes, toggleTaskCompleted, addNote } = useAppData();

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 4);
  const recentNotes = notes.slice(0, 3);
  const criticalAttendanceCount = attendance.filter(a => (a.attended / a.total) * 100 < a.targetPercentage).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-700 to-purple-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Academic Workspace</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, Alex! 👋
            </h1>
            <p className="text-indigo-100 text-xs md:text-sm font-medium leading-relaxed">
              "Continuous learning is the minimum requirement for success in any field." You're currently on a <strong>{stats.studyStreakDays}-day study streak</strong>!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModule('topic-explainer')}
              className="bg-white text-brand-700 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Launch AI Explainer</span>
            </button>
            <button
              onClick={() => setActiveModule('quiz-generator')}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quick Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Notes Saved */}
        <div 
          onClick={() => setActiveModule('notes')}
          className="glass-card p-5 cursor-pointer hover:border-brand-500/50 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Notes Saved</span>
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stats.notesCount}</span>
            <span className="text-[11px] text-brand-500 font-medium group-hover:underline flex items-center gap-0.5">
              View Hub <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 2: Active Tasks */}
        <div 
          onClick={() => setActiveModule('tasks')}
          className="glass-card p-5 cursor-pointer hover:border-indigo-500/50 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Tasks</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stats.tasksCount}</span>
            <span className="text-[11px] text-indigo-500 font-medium group-hover:underline flex items-center gap-0.5">
              Manage Tasks <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 3: Overall Attendance */}
        <div 
          onClick={() => setActiveModule('attendance')}
          className="glass-card p-5 cursor-pointer hover:border-emerald-500/50 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Attendance</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
              stats.attendancePercentage < 75 
                ? 'bg-rose-500/10 text-rose-500' 
                : 'bg-emerald-500/10 text-emerald-500'
            }`}>
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stats.attendancePercentage}%</span>
              {criticalAttendanceCount > 0 && (
                <span className="text-[10px] bg-rose-500/20 text-rose-500 font-bold px-1.5 py-0.5 rounded-full border border-rose-500/30">
                  {criticalAttendanceCount} Low
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium group-hover:underline flex items-center gap-0.5">
              Tracker <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Stat 4: Study Streak */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Study Streak</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stats.studyStreakDays} Days</span>
            <span className="text-[11px] text-amber-500 font-bold">🔥 On Fire!</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Deadlines & Shortcuts, Right Attendance & Recent Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Action Launcher Grid */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Quick AI Shortcuts</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveModule('topic-explainer')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500 hover:bg-slate-850 transition text-left group shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition border border-brand-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs font-extrabold text-slate-100">Topic Explainer</p>
                <p className="text-[10px] text-slate-400 font-medium">ELI5 & Metaphors</p>
              </button>

              <button
                onClick={() => setActiveModule('quiz-generator')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-850 transition text-left group shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition border border-indigo-500/30">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <p className="text-xs font-extrabold text-slate-100">Quiz Generator</p>
                <p className="text-[10px] text-slate-400 font-medium">Interactive tests</p>
              </button>

              <button
                onClick={() => setActiveModule('code-debugger')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 hover:bg-slate-850 transition text-left group shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition border border-purple-500/30">
                  <Bug className="w-4 h-4" />
                </div>
                <p className="text-xs font-extrabold text-slate-100">Code Debugger</p>
                <p className="text-[10px] text-slate-400 font-medium">Root cause & fixes</p>
              </button>

              <button
                onClick={() => setActiveModule('code-studio')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-slate-850 transition text-left group shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition border border-emerald-500/30">
                  <Code2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-extrabold text-slate-100">Code Translator</p>
                <p className="text-[10px] text-slate-400 font-medium">Python to JS/C++</p>
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Upcoming Deadlines & Tasks</span>
              </h3>
              <button 
                onClick={() => setActiveModule('tasks')}
                className="text-xs font-extrabold text-brand-500 hover:underline flex items-center gap-1"
              >
                View All ({tasks.length}) <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((t) => (
                  <div 
                    key={t.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaskCompleted(t.id)}
                        className="w-5 h-5 rounded-md border border-slate-600 hover:border-brand-500 flex items-center justify-center text-brand-500 transition"
                      >
                        {t.completed && <CheckCircle2 className="w-4 h-4 fill-brand-500 text-white" />}
                      </button>
                      <div>
                        <p className={`text-xs font-extrabold ${t.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {t.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">{t.subject} • Due {new Date(t.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      t.priority === 'high' 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                        : t.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {t.priority.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">All tasks completed! 🎉</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-6">
          {/* Subject Attendance Mini Widget */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-500" />
                <span>Attendance Alerts</span>
              </h3>
              <button
                onClick={() => setActiveModule('attendance')}
                className="text-xs font-bold text-emerald-500 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {attendance.slice(0, 4).map((sub) => {
                const pct = Math.round((sub.attended / sub.total) * 100);
                const isCritical = pct < sub.targetPercentage;
                return (
                  <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-100 truncate max-w-[140px]">{sub.name}</span>
                      <span className={isCritical ? 'text-rose-400 font-extrabold' : 'text-slate-300'}>
                        {pct}% ({sub.attended}/{sub.total})
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${isCritical ? 'bg-rose-500' : pct > 85 ? 'bg-emerald-400' : 'bg-brand-500'}`} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    {isCritical && (
                      <p className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Below 75% target threshold!
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Class Notes */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Recent Notes</span>
              </h3>
              <button
                onClick={() => setActiveModule('notes')}
                className="text-xs font-bold text-purple-500 hover:underline"
              >
                Open Hub
              </button>
            </div>

            <div className="space-y-3">
              {recentNotes.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => setActiveModule('notes')}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition"
                >
                  <p className="text-xs font-extrabold text-slate-100 line-clamp-1">{n.title}</p>
                  <p className="text-[10px] text-slate-400 mb-2 font-medium">{n.subject}</p>
                  <div className="flex gap-1 flex-wrap">
                    {n.tags.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-bold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
