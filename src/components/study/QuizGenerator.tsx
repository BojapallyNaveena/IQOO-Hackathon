import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { generateQuiz } from '../../services/aiEngine';
import type { QuizSession } from '../../types';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  Award, 
  Clock, 
  Loader2, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export const QuizGenerator: React.FC = () => {
  const { addQuizResult, addNote, showToast } = useAppData();

  const [topic, setTopic] = useState('Data Structures & Algorithms');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [numQuestions, setNumQuestions] = useState<number>(3);
  const [loading, setLoading] = useState(false);

  // Active quiz runner state
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const handleCreateQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const qz = await generateQuiz(topic, difficulty, numQuestions);
      setSession(qz);
      setCurrentIdx(0);
      setUserAnswers({});
      setQuizFinished(false);
    } catch (e) {
      showToast('Error generating quiz', 'alert');
    } finally {
      setLoading(false);
    }
  };

  // Select Option
  const handleSelectOption = (optIdx: number) => {
    if (userAnswers[currentIdx] !== undefined || quizFinished) return;
    setUserAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleNext = () => {
    if (!session) return;
    if (currentIdx < session.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!session) return;
    let correctCount = 0;
    session.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correctCount++;
    });

    const scorePct = Math.round((correctCount / session.questions.length) * 100);
    const finalSession: QuizSession = {
      ...session,
      userAnswers,
      score: scorePct,
      completedAt: new Date().toISOString()
    };

    setSession(finalSession);
    setQuizFinished(true);
    addQuizResult(finalSession);

    if (scorePct >= 70) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleSaveQuizToNotes = () => {
    if (!session) return;
    const content = `# Quiz Results: ${session.topic}\nScore: ${session.score}%\nDifficulty: ${session.difficulty}\n\n${session.questions.map((q, idx) => `### Q${idx + 1}: ${q.question}\n- Your Answer: ${q.options[userAnswers[idx] ?? -1] ?? 'None'}\n- Correct Answer: ${q.options[q.correctIndex]}\n- Explanation: ${q.explanation}`).join('\n\n')}`;
    
    addNote({
      title: `Quiz Review - ${session.topic}`,
      subject: 'Quizzes',
      content,
      tags: ['Quiz', session.topic]
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Setup Card */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-900 border-purple-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">AI Quiz & Practice Generator</h1>
            <p className="text-xs text-slate-400">Generate targeted multiple-choice tests with step-by-step scoring analytics and detailed explanations.</p>
          </div>
        </div>

        {/* Quiz Setup Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Subject / Topic Prompt</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Operating Systems, Organic Chemistry..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Difficulty Level</label>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    difficulty === d 
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                      : 'bg-slate-950/60 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Questions Count</label>
            <div className="flex gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumQuestions(num)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition ${
                    numQuestions === num
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-slate-950/60 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateQuiz}
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Generating Quiz...' : 'Start New AI Quiz'}</span>
        </button>
      </div>

      {/* Quiz Runner Interface */}
      {session && !quizFinished && (
        <div className="glass-card p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
          {/* Stepper Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-purple-500 uppercase">
                {session.difficulty} DIFFICULTY • {session.topic}
              </span>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                Question {currentIdx + 1} of {session.questions.length}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                {Math.round(((currentIdx + 1) / session.questions.length) * 100)}% Progress
              </span>
            </div>
          </div>

          {/* Question & Options */}
          {(() => {
            const q = session.questions[currentIdx];
            const selectedOpt = userAnswers[currentIdx];
            const isAnswered = selectedOpt !== undefined;

            return (
              <div className="space-y-6">
                {/* Question Card Box */}
                <div className="p-5 rounded-2xl bg-purple-500/10 dark:bg-slate-900/90 border border-purple-500/30 shadow-sm">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
                    Question {currentIdx + 1}
                  </span>
                  <p className="text-base md:text-lg font-extrabold text-slate-900 dark:text-slate-50 leading-relaxed">
                    {q.question}
                  </p>
                </div>

                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => {
                    let style = 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-800 font-medium';
                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        style = 'bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold shadow-sm';
                      } else if (optIdx === selectedOpt) {
                        style = 'bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-300 font-bold';
                      } else {
                        style = 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-2xl border text-xs md:text-sm text-left transition flex items-center justify-between shadow-xs ${style}`}
                      >
                        <span className="flex-1 pr-2">{opt}</span>
                        {isAnswered && optIdx === q.correctIndex && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                        {isAnswered && optIdx === selectedOpt && optIdx !== q.correctIndex && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isAnswered && (
                  <div className="p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/40 text-xs md:text-sm text-indigo-950 dark:text-indigo-100 space-y-1 shadow-sm">
                    <p className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                      <HelpCircle className="w-4 h-4" /> Answer Explanation:
                    </p>
                    <p className="leading-relaxed font-medium">{q.explanation}</p>
                  </div>
                )}

                {/* Action Stepper Button */}
                <div className="flex justify-end pt-2">
                  <button
                    disabled={!isAnswered}
                    onClick={handleNext}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-extrabold text-xs md:text-sm px-6 py-3 rounded-2xl shadow-lg transition flex items-center gap-2"
                  >
                    <span>{currentIdx === session.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Quiz Finished Results Dashboard */}
      {session && quizFinished && (
        <div className="glass-card p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-3 py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Quiz Complete!</h2>
            <p className="text-xs text-slate-400">Here is your performance breakdown for {session.topic}</p>

            <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl">
              <span className="text-3xl font-extrabold text-purple-400">{session.score}%</span>
              <span className="text-xs font-semibold text-slate-300">
                {session.score! >= 80 ? '🌟 Outstanding Mastery!' : session.score! >= 60 ? '👍 Solid Understanding' : '📚 Needs Review'}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap justify-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <button
              onClick={handleSaveQuizToNotes}
              className="bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 text-xs font-bold px-4 py-2.5 rounded-xl border border-brand-500/30 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Save Results to Notes</span>
            </button>

            <button
              onClick={handleCreateQuiz}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
