import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Sun, Moon, Sparkles, Command, Plus, BookOpen, PieChart, CheckSquare, Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeModule, stats, setCommandPaletteOpen, setActiveModule, mobileMenuOpen, setMobileMenuOpen } = useAppData();
  const { theme, toggleTheme } = useTheme();

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dashboard': return 'Academic Dashboard';
      case 'topic-explainer': return 'AI Topic Explainer';
      case 'quiz-generator': return 'AI Quiz & Practice Generator';
      case 'summarizer': return 'AI Article & Lecture Summarizer';
      case 'code-studio': return 'Developer Code Generator & Translator';
      case 'code-debugger': return 'AI Code Debugger & Diagnostic Engine';
      case 'app-builder': return 'App & Website Prototype Studio';
      case 'interview-prep': return 'Interview Prep & Career Coach';
      case 'project-planner': return 'Capstone Project Planner';
      case 'attendance': return 'Attendance Tracker & Bunk Calculator';
      case 'notes': return 'Class Notes Hub';
      case 'tasks': return 'Task Manager & Deadline Reminders';
      default: return 'EduLearn Workspace';
    }
  };

  return (
    <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Title / Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-500 transition"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2 truncate max-w-[200px] sm:max-w-none">
          <span>{getModuleTitle()}</span>
        </h2>
      </div>

      {/* Center Search Bar / Command Palette Trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden md:flex items-center gap-3 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all w-72"
      >
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <span className="flex-1 text-left font-medium">Search tools, notes, or tasks...</span>
        <kbd className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm text-slate-400 flex items-center gap-0.5">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Right Stats & Actions */}
      <div className="flex items-center gap-3">
        {/* Attendance Chip */}
        <button
          onClick={() => setActiveModule('attendance')}
          className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold border transition ${
            stats.attendancePercentage < 75
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Att: {stats.attendancePercentage}%</span>
        </button>

        {/* Notes Count Chip */}
        <button
          onClick={() => setActiveModule('notes')}
          className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700/60"
        >
          <BookOpen className="w-3.5 h-3.5 text-brand-500" />
          <span>{stats.notesCount} Notes</span>
        </button>

        {/* Pending Tasks Chip */}
        <button
          onClick={() => setActiveModule('tasks')}
          className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700/60"
        >
          <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
          <span>{stats.tasksCount} Tasks</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 transition"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Quick Launch AI Tool */}
        <button
          onClick={() => setActiveModule('topic-explainer')}
          className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-brand-600/25 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </header>
  );
};
