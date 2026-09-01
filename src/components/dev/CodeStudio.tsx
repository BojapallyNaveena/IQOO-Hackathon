import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { translateCode } from '../../services/aiEngine';
import type { CodeTranslation } from '../../types';
import { 
  Code2, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Play, 
  Sparkles, 
  Loader2, 
  Terminal, 
  FileCode,
  CheckCircle2
} from 'lucide-react';

export const CodeStudio: React.FC = () => {
  const { showToast } = useAppData();
  const [sourceLang, setSourceLang] = useState('JavaScript');
  const [targetLang, setTargetLang] = useState('Python');
  const [code, setCode] = useState(`function processData(items) {
  // Multiply positive numbers by 2
  const result = items.filter(x => x > 0).map(x => x * 2);
  console.log("Processed elements:", result.length);
  return result;
}`);
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState<CodeTranslation | null>(null);
  const [copied, setCopied] = useState(false);

  // Simulated Console Execution Output
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setConsoleOutput(null);
    try {
      const res = await translateCode(code, sourceLang, targetLang);
      setTranslation(res);
    } catch (e) {
      showToast('Error translating code', 'alert');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Code copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulator = () => {
    try {
      setConsoleOutput("Output: Processed elements: 3\nResult array: [ 2, 6, 8 ]\nProgram exited with code 0.");
      showToast('Executed snippet successfully!', 'success');
    } catch (e) {
      setConsoleOutput("Error during execution");
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 border-emerald-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">Developer Code Generator & Translator</h1>
            <p className="text-xs text-slate-400">Generate clean modular code and translate algorithms between languages (Python, JS/TS, C++, Java, Rust, Go).</p>
          </div>
        </div>

        {/* Language Selection Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              {['JavaScript', 'TypeScript', 'Python', 'C++', 'Java', 'Rust', 'Go', 'SQL'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <ArrowRightLeft className="w-4 h-4 text-slate-500" />

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              {['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'Rust', 'Go', 'SQL'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTranslate}
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Translating...' : `Translate to ${targetLang}`}</span>
          </button>
        </div>
      </div>

      {/* Editor & Side-by-Side View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Code Panel */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-2 text-slate-200">
              <FileCode className="w-4 h-4 text-emerald-500" /> Original {sourceLang} Code
            </span>
            <button
              onClick={handleRunSimulator}
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 transition"
            >
              <Play className="w-3 h-3 fill-emerald-400" /> Run Sandbox
            </button>
          </div>

          <textarea
            rows={12}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>

        {/* Translated Output Panel */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-2 text-slate-200">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Translated {targetLang} Output
            </span>
            {translation && (
              <button
                onClick={() => handleCopy(translation.translatedCode)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <pre className="w-full h-[290px] bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-2xl border border-slate-800 overflow-x-auto leading-relaxed">
            {translation ? translation.translatedCode : '// Click "Translate to ' + targetLang + '" to see converted output...'}
          </pre>
        </div>
      </div>

      {/* Line-by-Line Conversion Explanations */}
      {translation && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Translation & Syntax Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {translation.explanation.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-emerald-400">Point {idx + 1}:</span> {exp}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulator Output Console */}
      {consoleOutput && (
        <div className="glass-card p-5 space-y-2 border-emerald-500/30">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Terminal className="w-4 h-4" /> Execution Console Log Output
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
            {consoleOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
