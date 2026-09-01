import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { debugCode } from '../../services/aiEngine';
import type { CodeDebugResult } from '../../types';
import { 
  Bug, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileCode 
} from 'lucide-react';

export const CodeDebugger: React.FC = () => {
  const { showToast } = useAppData();
  const [language, setLanguage] = useState('JavaScript / TypeScript');
  const [code, setCode] = useState(`async function fetchUserData(userId) {
  // Buggy API fetch missing try/catch and response check
  const response = fetch('/api/user/' + userId);
  const data = response.json(); // Error: response.json is not a function (missing await)
  return data.name;
}`);
  const [errorLog, setErrorLog] = useState('TypeError: response.json is not a function');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CodeDebugResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDebug = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const data = await debugCode(code, language, errorLog);
      setResult(data);
    } catch (e) {
      showToast('Error diagnosing code', 'alert');
    } finally {
      setLoading(false);
    }
  };

  // Run initial debug
  React.useEffect(() => {
    handleDebug();
  }, []);

  const handleCopyFixed = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.fixedCode);
    setCopied(true);
    showToast('Fixed code copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Setup Card */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-rose-900/30 via-slate-900 to-slate-900 border-rose-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">AI Code Debugger & Diagnostic Engine</h1>
            <p className="text-xs text-slate-400">Analyze bugs, identify root causes, and get step-by-step corrected code with best practice recommendations.</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <label className="text-xs font-bold text-slate-300">Buggy Source Code</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-rose-500"
            >
              {['JavaScript / TypeScript', 'Python', 'C++', 'Java', 'Rust', 'Go'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <textarea
            rows={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your buggy code snippet..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl p-4 text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500"
          />

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Error Message / Stack Trace (Optional)</label>
            <input
              type="text"
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="e.g. TypeError: Cannot read properties of undefined..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>

          <button
            onClick={handleDebug}
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Analyzing Bugs...' : 'Analyze & Fix Bug'}</span>
          </button>
        </div>
      </div>

      {/* Debug Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary & Health Score Banner */}
          <div className="glass-card p-6 border-rose-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Category: {result.bugCategory}
                </span>
                <span className="text-xs font-semibold text-slate-400">Language: {result.language}</span>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Code Health Score: {result.healthScore}/100</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Root Cause Diagnosis</span>
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {result.rootCause}
              </p>
            </div>
          </div>

          {/* Corrected Code Viewer */}
          <div className="glass-card p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Fixed & Refactored Solution Code
              </span>
              <button
                onClick={handleCopyFixed}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Fixed Code'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              {result.fixedCode}
            </pre>
          </div>

          {/* Line-by-Line Fixes & Best Practices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Step-by-Step Resolution</span>
              </h3>
              <div className="space-y-2">
                {result.lineByLineFixes.map((fix, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <span className="font-bold text-emerald-400">{idx + 1}.</span>
                    <span>{fix}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Preventative Best Practices</span>
              </h3>
              <div className="space-y-2">
                {result.bestPractices.map((bp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-300">
                    💡 {bp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
