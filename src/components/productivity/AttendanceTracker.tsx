import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import type { SubjectAttendance } from '../../types';
import { 
  PieChart, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Trash2, 
  ShieldCheck, 
  HelpCircle,
  Calculator
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const { attendance, logAttendance, addSubject, deleteSubject } = useAppData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newAttended, setNewAttended] = useState(20);
  const [newTotal, setNewTotal] = useState(25);

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addSubject({
      code: newCode.trim() || 'CS101',
      name: newName.trim(),
      attended: Number(newAttended),
      total: Number(newTotal),
      targetPercentage: 75
    });

    setNewCode('');
    setNewName('');
    setShowAddModal(false);
  };

  // Helper Bunk Formula Calculator
  const calculateBunkStatus = (attended: number, total: number, targetPct: number = 75) => {
    const currentPct = total > 0 ? (attended / total) * 100 : 100;

    if (currentPct >= targetPct) {
      // Calculate how many more classes student can skip
      // (attended) / (total + x) >= 0.75  =>  x <= (attended / 0.75) - total
      const maxSkippable = Math.floor((attended / (targetPct / 100)) - total);
      return {
        safe: true,
        message: maxSkippable > 0 ? `Safe! You can skip ${maxSkippable} more class${maxSkippable > 1 ? 'es' : ''} and stay above 75%.` : `Borderline safe! Do not miss any upcoming classes.`
      };
    } else {
      // Calculate how many consecutive classes student MUST attend to reach targetPct
      // (attended + y) / (total + y) >= 0.75  =>  y >= (0.75 * total - attended) / (1 - 0.75)
      const targetFraction = targetPct / 100;
      const requiredClasses = Math.ceil((targetFraction * total - attended) / (1 - targetFraction));
      return {
        safe: false,
        message: `CRITICAL ALERT! Must attend ${requiredClasses} consecutive class${requiredClasses > 1 ? 'es' : ''} to reach 75% threshold.`
      };
    }
  };

  const totalAttendedAll = attendance.reduce((a, b) => a + b.attended, 0);
  const totalClassesAll = attendance.reduce((a, b) => a + b.total, 0);
  const overallPct = totalClassesAll > 0 ? Math.round((totalAttendedAll / totalClassesAll) * 100) : 100;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-100">Subject Attendance Tracker</h1>
              <p className="text-xs text-slate-400">Keep attendance above 75% with visual radial charts and intelligent Bunk Calculator formulas.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Overall Attendance</span>
              <span className={`text-xl font-extrabold ${overallPct < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {overallPct}%
              </span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendance.map((sub) => {
          const pct = Math.round((sub.attended / sub.total) * 100);
          const status = calculateBunkStatus(sub.attended, sub.total, sub.targetPercentage);
          const isCritical = pct < sub.targetPercentage;

          // SVG Radial Circle metrics
          const radius = 36;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (pct / 100) * circumference;

          return (
            <div key={sub.id} className={`glass-card p-6 relative flex flex-col justify-between transition border ${isCritical ? 'border-rose-500/40 bg-rose-950/10' : 'hover:border-emerald-500/30'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{sub.code}</span>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{sub.name}</h3>
                </div>

                <button
                  onClick={() => deleteSubject(sub.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Center Gauge & Quick Counts */}
              <div className="flex items-center gap-4 py-2">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className={`transition-all duration-700 ${isCritical ? 'stroke-rose-500' : pct > 85 ? 'stroke-emerald-400' : 'stroke-brand-500'}`}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className={`text-base font-extrabold ${isCritical ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-400 font-medium">
                    Attended: <strong className="text-slate-200 font-bold">{sub.attended}</strong> / {sub.total} classes
                  </p>
                  <p className="text-slate-400 font-medium">
                    Target: <span className="text-slate-300 font-semibold">{sub.targetPercentage}%</span>
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => logAttendance(sub.id, 1, 1)}
                      className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-2.5 py-1 rounded-lg text-xs border border-emerald-500/30 transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> +1 Attended
                    </button>

                    <button
                      onClick={() => logAttendance(sub.id, 0, 1)}
                      className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold px-2.5 py-1 rounded-lg text-xs border border-rose-500/30 transition flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" /> +1 Missed
                    </button>
                  </div>
                </div>
              </div>

              {/* Bunk Calculator Advice Card */}
              <div className={`mt-4 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 border ${
                status.safe
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {status.safe ? <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                <p className="leading-tight">{status.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">Add New Subject</h3>
            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">Subject Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. CS301"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">Subject Title</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Attended Classes</label>
                  <input
                    type="number"
                    value={newAttended}
                    onChange={(e) => setNewAttended(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Total Classes</label>
                  <input
                    type="number"
                    value={newTotal}
                    onChange={(e) => setNewTotal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
