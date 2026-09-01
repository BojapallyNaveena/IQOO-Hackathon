import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { generateProjectPlan } from '../../services/aiEngine';
import { ProjectRecommendation } from '../../types';
import { 
  Compass, 
  Sparkles, 
  BookOpen, 
  Loader2, 
  Clock, 
  Layers, 
  CheckSquare, 
  ChevronRight,
  Code
} from 'lucide-react';

export const ProjectPlanner: React.FC = () => {
  const { addNote, showToast } = useAppData();
  const [topic, setTopic] = useState('AI Academic Assistant & Workspace');
  const [domain, setDomain] = useState('Full Stack Web & AI');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ProjectRecommendation | null>(null);

  const handleGeneratePlan = async (overrideTopic?: string) => {
    const t = overrideTopic ?? topic;
    if (!t.trim()) return;
    setLoading(true);
    try {
      const data = await generateProjectPlan(t, domain);
      setPlan(data);
    } catch (e) {
      showToast('Error generating project plan', 'alert');
    } finally {
      setLoading(false);
    }
  };

  // Run initial generator
  React.useEffect(() => {
    handleGeneratePlan('AI Academic Assistant & Workspace');
  }, []);

  const handleSaveToNotes = () => {
    if (!plan) return;
    const content = `# Project Plan: ${plan.title}\nDomain: ${plan.domain}\nDifficulty: ${plan.difficulty}\n\n## Tech Stack\n${plan.techStack.join(', ')}\n\n## Milestones & Roadmap\n${plan.milestones.map(m => `### ${m.phase} (${m.duration})\n${m.description}\nDeliverables:\n${m.deliverables.map(d => `- [ ] ${d}`).join('\n')}`).join('\n\n')}`;
    
    addNote({
      title: `Project Roadmap - ${plan.title}`,
      subject: 'Projects',
      content,
      tags: ['ProjectPlan', plan.domain]
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900 border-indigo-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">Project Planner & Milestone Recommender</h1>
            <p className="text-xs text-slate-400">Break down student capstone project ideas into 4-sprint milestone roadmaps and tech stack recommendations.</p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your project idea (e.g. AI Study Companion, E-Commerce Store)..."
            className="flex-1 bg-slate-950/80 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500"
          >
            {['Full Stack Web & AI', 'Mobile Development', 'Machine Learning & Data Science', 'Cybersecurity & Networks'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            onClick={() => handleGeneratePlan()}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 min-w-[150px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Planning...' : 'Generate Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Roadmap Output */}
      {plan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Card */}
          <div className="glass-card p-6 border-indigo-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">PROJECT ARCHITECTURE & ROADMAP</span>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{plan.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToNotes}
                  className="bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-xs font-bold px-4 py-2 rounded-xl border border-brand-500/30 transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> Save Roadmap to Notes
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {plan.description}
            </p>

            {/* Recommended Tech Stack Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-400" /> Recommended Technology Stack:
              </span>
              <div className="flex gap-2 flex-wrap">
                {plan.techStack.map((tech, idx) => (
                  <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-3 py-1 rounded-xl">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Sprint Milestone Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Sprint Roadmap & Phase Deliverables</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.milestones.map((m, idx) => (
                <div key={idx} className="glass-card p-6 border-indigo-500/20 relative space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/30">
                      Phase {idx + 1} • {m.duration}
                    </span>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{m.phase}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{m.description}</p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-300 block">Deliverables Checklist:</span>
                    {m.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="text-xs text-slate-300 flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
