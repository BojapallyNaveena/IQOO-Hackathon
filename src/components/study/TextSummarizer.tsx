import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { summarizeText } from '../../services/aiEngine';
import type { SummaryResult } from '../../types';
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Brain, 
  RotateCcw,
  Zap
} from 'lucide-react';

export const TextSummarizer: React.FC = () => {
  const { addNote, showToast } = useAppData();
  const [inputText, setInputText] = useState(`The React Fiber architecture represents a complete rewrite of the React core algorithm designed to enable concurrent rendering. Previous versions of React processed rendering synchronously in a single un-interruptible stack pass. If a component tree was large, this rendering pass could take tens of milliseconds, blocking the main UI thread and causing input lag or dropped animation frames. Fiber addresses this by dividing rendering work into incremental units called fibers. Each fiber corresponds to a React component and stores its state, props, and DOM refs in a linked list structure. This allows React to pause, resume, prioritize, or discard rendering work based on browser idle callbacks and user interaction urgency.`);
  const [format, setFormat] = useState<'bullets' | 'tldr' | 'flashcards' | 'mindmap'>('bullets');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);

  // Active flashcard flip state
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await summarizeText(inputText);
      setResult(data);
    } catch (e) {
      showToast('Error summarizing text', 'alert');
    } finally {
      setLoading(false);
    }
  };

  // Run initial summary
  React.useEffect(() => {
    handleSummarize();
  }, []);

  const handleSaveToNotes = () => {
    if (!result) return;
    const content = `# Summary: ${result.title}\n\n## TL;DR\n${result.tldr}\n\n## Key Bullet Points\n${result.bulletPoints.map(b => `- ${b}`).join('\n')}\n\n## Key Takeaways\n${result.keyTakeaways.map(k => `- ${k}`).join('\n')}`;

    addNote({
      title: `Summary - ${result.title}`,
      subject: 'Summaries',
      content,
      tags: ['Summary', 'AI-Condensed']
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-900 border-blue-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">AI Lecture & Paper Summarizer</h1>
            <p className="text-xs text-slate-400">Compress long articles, textbook chapters, or transcriptions into structured notes and flashcards.</p>
          </div>
        </div>

        {/* Input Textarea */}
        <div className="mt-6 space-y-3">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your paper abstract, article, or lecture transcript here..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Format Selection Pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
              <span className="text-slate-400">View Format:</span>
              {[
                { id: 'bullets', label: 'Bullet Notes' },
                { id: 'tldr', label: 'TL;DR Summary' },
                { id: 'flashcards', label: 'Flashcard Deck' },
                { id: 'mindmap', label: 'Mind Map Nodes' }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id as any)}
                  className={`px-3 py-1.5 rounded-xl border transition ${
                    format === fmt.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSummarize}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loading ? 'Summarizing...' : 'Summarize Text'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Metrics & Save Banner */}
          <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-blue-500/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/30 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>85% Time Saved (~6 mins)</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>High Compression Ratio</span>
              </div>
            </div>

            <button
              onClick={handleSaveToNotes}
              className="bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-xs font-bold px-4 py-2 rounded-xl border border-brand-500/30 transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Save Summary to Notes</span>
            </button>
          </div>

          {/* Active Format Content */}
          {format === 'bullets' && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Structured Outline & Bullet Notes</span>
              </h3>

              <div className="space-y-3">
                {result.bulletPoints.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{pt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {format === 'tldr' && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Executive TL;DR Summary</span>
              </h3>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-sm font-medium leading-relaxed">
                "{result.tldr}"
              </div>

              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Takeaways</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.keyTakeaways.map((k, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-300">
                      ✅ {k}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {format === 'flashcards' && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>Interactive Study Flashcards (Click card to flip)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.flashcards.map((card, idx) => {
                  const isFlipped = flippedCards[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      className="h-44 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 flex flex-col justify-between cursor-pointer hover:border-purple-500 transition shadow-lg group select-none"
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        <span>Card {idx + 1}</span>
                        <span className="flex items-center gap-1 text-slate-400 group-hover:text-white">
                          <RotateCcw className="w-3 h-3" /> Flip
                        </span>
                      </div>

                      <div className="my-auto text-center">
                        <p className="text-xs font-bold text-slate-100">
                          {isFlipped ? card.answer : card.question}
                        </p>
                      </div>

                      <span className="text-[10px] text-slate-500 text-center font-mono">
                        {isFlipped ? 'Showing Answer' : 'Click to reveal answer'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {format === 'mindmap' && (
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Concept Mind Map Breakdown</span>
              </h3>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-4">
                <div className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold shadow-lg">
                  {result.mindMapNodes[0]?.label ?? 'Core Concept'}
                </div>
                <div className="w-0.5 h-6 bg-slate-700" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {result.mindMapNodes.slice(1, 3).map((node) => (
                    <div key={node.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs font-semibold text-indigo-300">
                      {node.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
