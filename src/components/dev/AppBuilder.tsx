import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { generateAppPrototype } from '../../services/aiEngine';
import type { AppPrototype } from '../../types';
import { 
  Boxes, 
  Sparkles, 
  Eye, 
  Code, 
  Copy, 
  Check, 
  Loader2, 
  Play, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

export const AppBuilder: React.FC = () => {
  const { showToast } = useAppData();
  const [prompt, setPrompt] = useState('Interactive Task Flow App');
  const [stack, setStack] = useState('React 18 + Tailwind CSS');
  const [loading, setLoading] = useState(false);
  const [prototype, setPrototype] = useState<AppPrototype | null>(null);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleBuildApp = async (overridePrompt?: string) => {
    const p = overridePrompt ?? prompt;
    if (!p.trim()) return;
    setLoading(true);
    try {
      const data = await generateAppPrototype(p, stack);
      setPrototype(data);
      setActiveFileIdx(0);
    } catch (e) {
      showToast('Error building prototype', 'alert');
    } finally {
      setLoading(false);
    }
  };

  // Build initial prototype on load
  React.useEffect(() => {
    handleBuildApp('Interactive Task Flow App');
  }, []);

  const handleCopyCode = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    showToast('Code copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900 border-indigo-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">App & Website Prototype Studio</h1>
            <p className="text-xs text-slate-400">Generate runnable full-stack web prototypes with multi-file code and interactive live previews.</p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your prototype app idea (e.g. Student Portfolio, Weather Dashboard)..."
              className="flex-1 bg-slate-950/80 border border-slate-700 rounded-2xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={() => handleBuildApp()}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 min-w-[150px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loading ? 'Building...' : 'Generate App'}</span>
            </button>
          </div>

          {/* Preset Template Chips */}
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="text-slate-500">Preset Ideas:</span>
            {['Interactive Task Flow App', 'Student Portfolio Site', 'Weather API Dashboard', 'E-Commerce Shopping Cart'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPrompt(p);
                  handleBuildApp(p);
                }}
                className="text-slate-400 hover:text-indigo-400 bg-slate-800/50 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/50 transition"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Interface */}
      {prototype && (
        <div className="glass-card overflow-hidden border-indigo-500/20">
          {/* Top Bar with Mode Toggle & File Tabs */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Files:</span>
              {prototype.files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveFileIdx(idx);
                    setViewMode('code');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border shrink-0 ${
                    activeFileIdx === idx && viewMode === 'code'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  📄 {file.filename}
                </button>
              ))}
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  viewMode === 'preview'
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Live Preview
              </button>

              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  viewMode === 'code'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Source Code
              </button>

              <button
                onClick={() => handleCopyCode(prototype.files[activeFileIdx].content)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                title="Copy Active File"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Content Area */}
          {viewMode === 'preview' ? (
            <div className="p-4 bg-slate-950 flex flex-col items-center">
              <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Browser Frame Window Header */}
                <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">https://edulearn-prototype.local</span>
                  <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                </div>

                {/* Live Sandbox iframe */}
                <iframe
                  title="App Prototype Preview"
                  srcDoc={prototype.previewHtml}
                  className="w-full h-[400px] border-none bg-slate-900"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-950">
              <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-[420px]">
                {prototype.files[activeFileIdx]?.content}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
