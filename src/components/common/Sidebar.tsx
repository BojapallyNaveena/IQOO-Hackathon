import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { ActiveModule } from '../../types';
import { 
  LayoutDashboard, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Code2, 
  Bug, 
  Boxes, 
  UserCheck, 
  Compass, 
  PieChart, 
  BookOpen, 
  CheckSquare,
  AlertTriangle,
  Flame,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: ActiveModule;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

import { X } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, tasks, attendance, mobileMenuOpen, setMobileMenuOpen } = useAppData();

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const criticalAttendance = attendance.some(a => (a.attended / a.total) * 100 < a.targetPercentage);

  const navigation: NavGroup[] = [
    {
      groupName: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      groupName: 'AI STUDY TOOLS',
      items: [
        { id: 'topic-explainer', label: 'Topic Explainer', icon: Sparkles },
        { id: 'quiz-generator', label: 'Quiz & Practice', icon: HelpCircle },
        { id: 'summarizer', label: 'Text Summarizer', icon: FileText }
      ]
    },
    {
      groupName: 'DEVELOPER STUDIO',
      items: [
        { id: 'code-studio', label: 'Code & Translator', icon: Code2 },
        { id: 'code-debugger', label: 'Code Debugger', icon: Bug },
        { id: 'app-builder', label: 'App Prototype Builder', icon: Boxes }
      ]
    },
    {
      groupName: 'CAREER & PROJECTS',
      items: [
        { id: 'interview-prep', label: 'Interview Prep Coach', icon: UserCheck },
        { id: 'project-planner', label: 'Project Planner', icon: Compass }
      ]
    },
    {
      groupName: 'PRODUCTIVITY UTILITIES',
      items: [
        { 
          id: 'attendance', 
          label: 'Attendance Tracker', 
          icon: PieChart, 
          badge: criticalAttendance ? 'Alert' : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
        },
        { id: 'notes', label: 'Class Notes Hub', icon: BookOpen },
        { 
          id: 'tasks', 
          label: 'Tasks & Deadlines', 
          icon: CheckSquare, 
          badge: pendingTasks > 0 ? pendingTasks : undefined,
          badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/30'
        }
      ]
    }
  ];

  const handleNavigate = (id: ActiveModule) => {
    setActiveModule(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800/80 flex flex-col h-screen fixed inset-y-0 left-0 z-50 md:sticky md:top-0 transition-transform duration-200 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 font-extrabold text-xl">
              E
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight gradient-text">EduLearn</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">AI Academic Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>7d</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigation.map((group, idx) => (
            <div key={idx}>
              <h2 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
                {group.groupName}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-brand-500'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User Card / Status */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
              NS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">Alex Rivers</p>
              <p className="text-[10px] text-slate-400 truncate">CS & AI Major (Yr 3)</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
