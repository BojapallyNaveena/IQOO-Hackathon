import React, { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { ActiveModule } from '../../types';
import { 
  Search, 
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
  X,
  LayoutDashboard
} from 'lucide-react';

interface PaletteOption {
  id: ActiveModule;
  title: string;
  category: string;
  icon: React.ElementType;
}

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveModule } = useAppData();
  const [query, setQuery] = useState('');

  const options: PaletteOption[] = [
    { id: 'dashboard', title: 'Dashboard Overview', category: 'General', icon: LayoutDashboard },
    { id: 'topic-explainer', title: 'AI Topic Explainer (ELI5 & Diagrams)', category: 'AI Study Tools', icon: Sparkles },
    { id: 'quiz-generator', title: 'Quiz & Practice Test Generator', category: 'AI Study Tools', icon: HelpCircle },
    { id: 'summarizer', title: 'Lecture & Article Summarizer', category: 'AI Study Tools', icon: FileText },
    { id: 'code-studio', title: 'Code Generator & Multi-Language Translator', category: 'Developer Studio', icon: Code2 },
    { id: 'code-debugger', title: 'AI Code Debugger & Diagnostic Engine', category: 'Developer Studio', icon: Bug },
    { id: 'app-builder', title: 'App & Website Prototype Studio', category: 'Developer Studio', icon: Boxes },
    { id: 'interview-prep', title: 'Interview Prep Coach (Technical & HR)', category: 'Career', icon: UserCheck },
    { id: 'project-planner', title: 'Capstone Project Roadmap Planner', category: 'Career', icon: Compass },
    { id: 'attendance', title: 'Attendance Tracker & Bunk Formula', category: 'Productivity', icon: PieChart },
    { id: 'notes', title: 'Class Notes Hub & Markdown Editor', category: 'Productivity', icon: BookOpen },
    { id: 'tasks', title: 'Tasks & Deadline Manager', category: 'Productivity', icon: CheckSquare },
  ];

  // Listen for Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filtered = options.filter(opt => 
    opt.title.toLowerCase().includes(query.toLowerCase()) || 
    opt.category.toLowerCase().includes(query.toLowerCase())
  );

  const selectModule = (id: ActiveModule) => {
    setActiveModule(id);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to module..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button 
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => selectModule(item.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                      <p className="text-[10px] text-slate-400">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Jump ↵</span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching modules found for "{query}".
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
          <span>Use <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">ESC</kbd> to close</span>
          <span>EduLearn Fast Launcher</span>
        </div>
      </div>
    </div>
  );
};
