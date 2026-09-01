import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 border-slate-700 text-white';
        let icon = <Info className="w-4 h-4 text-blue-400" />;

        if (toast.type === 'success') {
          bg = 'bg-slate-900 border-emerald-500/40 text-emerald-100';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
        } else if (toast.type === 'alert') {
          bg = 'bg-rose-950 border-rose-500/40 text-rose-100';
          icon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950 border-amber-500/40 text-amber-100';
          icon = <AlertCircle className="w-4 h-4 text-amber-400" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200 ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="text-xs font-semibold">{toast.title}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-75 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
