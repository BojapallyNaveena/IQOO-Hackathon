import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { getInterviewQuestion, evaluateInterviewAnswer } from '../../services/aiEngine';
import { InterviewQuestion, InterviewFeedback } from '../../types';
import { 
  UserCheck, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Lightbulb, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export const InterviewPrep: React.FC = () => {
  const { showToast } = useAppData();
  const [role, setRole] = useState('Frontend Developer');
  const [level, setLevel] = useState('Mid-Level');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [questionData, setQuestionData] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);

  const handleFetchQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');
    try {
      const q = await getInterviewQuestion(role, level);
      setQuestionData(q);
    } catch (e) {
      showToast('Error loading question', 'alert');
    } finally {
      setLoading(false);
    }
  };

  // Run initial question fetch
  React.useEffect(() => {
    handleFetchQuestion();
  }, []);

  const handleEvaluate = async () => {
    if (!questionData || !userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const fb = await evaluateInterviewAnswer(questionData.question, userAnswer);
      setFeedback(fb);
    } catch (e) {
      showToast('Error evaluating response', 'alert');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900 border-indigo-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">Interview Prep Coach</h1>
            <p className="text-xs text-slate-400">Simulate real technical & behavioral interviews with instant feedback on clarity, missing keywords, and model answers.</p>
          </div>
        </div>

        {/* Role & Level Selector */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              {['Frontend Developer', 'Backend Engineer', 'Data Scientist', 'AI/ML Engineer', 'Full Stack Developer', 'Behavioral HR'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              {['Junior', 'Mid-Level', 'Senior'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleFetchQuestion}
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Fetching...' : 'Next Question'}</span>
          </button>
        </div>
      </div>

      {/* Question & Practice Card */}
      {questionData && (
        <div className="glass-card p-6 md:p-8 space-y-6">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
              {questionData.role} • {questionData.level} • {questionData.type}
            </span>
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1 leading-relaxed">
              "{questionData.question}"
            </h2>
          </div>

          {/* Answer Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 block">Your Answer</label>
            <textarea
              rows={5}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your structured answer here (use STAR method for behavioral or explain architecture for technical)..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            />

            <div className="flex justify-end">
              <button
                onClick={handleEvaluate}
                disabled={evaluating || !userAnswer.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2"
              >
                {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{evaluating ? 'Evaluating Answer...' : 'Evaluate My Answer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Dashboard */}
      {feedback && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card p-6 border-indigo-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Coach Evaluation</span>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Overall Response Score</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-2xl border border-indigo-500/30">
                  <Award className="w-5 h-5" />
                  <span className="text-xl font-extrabold">{feedback.score}/100</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Clarity & Communication</span>
                <span className="text-lg font-bold text-indigo-400">{feedback.clarityScore}%</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Technical Accuracy</span>
                <span className="text-lg font-bold text-emerald-400">{feedback.technicalAccuracyScore}%</span>
              </div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Response Strengths</span>
              </h3>
              <div className="space-y-2">
                {feedback.strengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-300">
                    ✅ {str}
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Keywords & Tips */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Missing Key Technical Terms</span>
              </h3>
              <div className="flex gap-2 flex-wrap mb-4">
                {feedback.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    +{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Model Answer Comparison */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              <span>Model Benchmark Answer</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-950 border border-slate-800 font-sans">
              "{feedback.sampleBetterAnswer}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
