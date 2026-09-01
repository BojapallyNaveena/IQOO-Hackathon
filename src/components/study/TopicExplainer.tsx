import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { explainTopic } from '../../services/aiEngine';
import type { TopicExplanation } from '../../types';
import { 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Loader2, 
  Layers, 
  Share2, 
  ArrowRight,
  Code
} from 'lucide-react';

export const TopicExplainer: React.FC = () => {
  const { addNote, setActiveModule, showToast } = useAppData();
  const [concept, setConcept] = useState('React Virtual DOM');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TopicExplanation | null>(null);

  // Selected mini-quiz answer states
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const handleExplain = async (overrideConcept?: string, overrideLevel?: 'beginner' | 'intermediate' | 'advanced') => {
    const targetConcept = overrideConcept ?? concept;
    const targetLevel = overrideLevel ?? level;

    if (!targetConcept.trim()) return;

    setLoading(true);
    setQuizAnswers({});
    try {
      const data = await explainTopic(targetConcept, targetLevel);
      setResult(data);
    } catch (err) {
      showToast('Failed generating explanation', 'alert');
    } finally {
      setLoading(false);
    }
  };

  // Initial load auto-explain
  React.useEffect(() => {
    handleExplain('React Virtual DOM', 'beginner');
  }, []);

  const handleSaveToNotes = () => {
    if (!result) return;
    const noteContent = `# ${result.concept} (${result.level.toUpperCase()})\n\n## Overview\n${result.overview}\n\n## Analogy: ${result.analogy.title}\n${result.analogy.description}\n\n## Key Terms\n${result.keyTerms.map(k => `- **${k.term}**: ${k.definition}`).join('\n')}\n\n## Deep Dive\n${result.deepDivePoints.map(p => `- ${p}`).join('\n')}`;
    
    addNote({
      title: `${result.concept} - AI Explanation`,
      subject: 'AI Study Tools',
      content: noteContent,
      tags: ['AI-Explainer', result.concept, result.level]
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border-indigo-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">AI Topic Explainer</h1>
            <p className="text-xs text-slate-400">Master complex academic concepts with customizable depth levels and intuitive visual analogies.</p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
              placeholder="Enter any academic concept (e.g., Quantum Computing, Fourier Transform)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
            />
          </div>

          <button
            onClick={() => handleExplain()}
            disabled={loading}
            className="bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2 min-w-[140px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Explaining...' : 'Explain Topic'}</span>
          </button>
        </div>

        {/* Depth Pills */}
        <div className="mt-4 flex items-center gap-2 flex-wrap text-xs font-semibold">
          <span className="text-slate-400 mr-2">Depth Level:</span>
          {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setLevel(lvl);
                handleExplain(concept, lvl);
              }}
              className={`px-3 py-1.5 rounded-xl capitalize border transition ${
                level === lvl
                  ? 'bg-brand-500 text-white border-brand-400 shadow-md'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {lvl === 'beginner' ? 'Beginner (ELI5)' : lvl === 'intermediate' ? 'Intermediate (Standard)' : 'Advanced (Deep Math/Code)'}
            </button>
          ))}
        </div>

        {/* Suggested Topic Chips */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px]">
          <span className="text-slate-500">Popular:</span>
          {['Quantum Computing', 'React Virtual DOM', 'Gradient Descent', 'Cellular Respiration', 'Fourier Transform'].map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setConcept(topic);
                handleExplain(topic, level);
              }}
              className="text-slate-400 hover:text-brand-400 bg-slate-800/40 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/50 transition"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Overview & Action Toolbar */}
          <div className="glass-card p-6 border-brand-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-brand-500 uppercase">
                  {result.level.toUpperCase()} LEVEL BREAKDOWN
                </span>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{result.concept}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToNotes}
                  className="bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-xs font-bold px-3.5 py-2 rounded-xl border border-brand-500/30 transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Save to Notes</span>
                </button>

                <button
                  onClick={() => setActiveModule('quiz-generator')}
                  className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 text-xs font-bold px-3.5 py-2 rounded-xl border border-indigo-500/30 transition flex items-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Take Quiz on This</span>
                </button>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              {result.overview}
            </p>
          </div>

          {/* Visual Analogy Card */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-purple-500/10 border border-amber-500/30 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Lightbulb className="w-6 h-6 fill-amber-500/20" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Visual Metaphor & Analogy</span>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{result.analogy.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {result.analogy.description}
                </p>
              </div>
            </div>
          </div>

          {/* Key Terminology Grid & Deep Dive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Terms */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-500" />
                <span>Key Terminology</span>
              </h3>
              <div className="space-y-3">
                {result.keyTerms.map((term, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-xs font-bold text-brand-500 mb-0.5">{term.term}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{term.definition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Dive Insights */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Deep Dive Concepts</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                {result.deepDivePoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Formula or Code Snippet (if available) */}
          {result.codeOrFormula && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-500" />
                <span>Technical Implementation / Formula</span>
              </h3>
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 text-xs overflow-x-auto border border-slate-800 font-mono">
                {result.codeOrFormula}
              </pre>
            </div>
          )}

          {/* Built-in Interactive Mini Quiz */}
          {result.miniQuiz.length > 0 && (
            <div className="glass-card p-6 border-indigo-500/30">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>Interactive Self-Check Mini Quiz</span>
              </h3>

              {result.miniQuiz.map((q) => {
                const selected = quizAnswers[q.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === q.correctIndex;

                return (
                  <div key={q.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-50">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-indigo-500 font-medium';
                        if (isAnswered) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold';
                          } else if (optIdx === selected) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-300 font-bold';
                          } else {
                            btnStyle = 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isAnswered}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                            className={`p-3 rounded-xl border text-xs text-left transition ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                        {isCorrect ? 'Correct! 🎉 ' : 'Incorrect. '} {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
