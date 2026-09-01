import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ActiveModule, Note, TaskItem, SubjectAttendance, QuizSession, UserStats } from '../types';
import { 
  loadNotesFromStorage, saveNotesToStorage,
  loadTasksFromStorage, saveTasksToStorage,
  loadAttendanceFromStorage, saveAttendanceToStorage,
  loadQuizzesFromStorage, saveQuizzesToStorage,
  getStudyStreakDays
} from '../services/localStorage';

export interface ToastMessage {
  id: string;
  title: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

interface AppDataContextType {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  attendance: SubjectAttendance[];
  logAttendance: (id: string, attendedDelta: number, totalDelta: number) => void;
  addSubject: (subject: Omit<SubjectAttendance, 'id'>) => void;
  deleteSubject: (id: string) => void;
  quizzes: QuizSession[];
  addQuizResult: (quiz: QuizSession) => void;
  stats: UserStats;
  toasts: ToastMessage[];
  showToast: (title: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [notes, setNotes] = useState<Note[]>(loadNotesFromStorage);
  const [tasks, setTasks] = useState<TaskItem[]>(loadTasksFromStorage);
  const [attendance, setAttendance] = useState<SubjectAttendance[]>(loadAttendanceFromStorage);
  const [quizzes, setQuizzes] = useState<QuizSession[]>(loadQuizzesFromStorage);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Sync to local storage
  useEffect(() => saveNotesToStorage(notes), [notes]);
  useEffect(() => saveTasksToStorage(tasks), [tasks]);
  useEffect(() => saveAttendanceToStorage(attendance), [attendance]);
  useEffect(() => saveQuizzesToStorage(quizzes), [quizzes]);

  // Toast Helper
  const showToast = (title: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Note CRUD
  const addNote = (newNoteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const created: Note = {
      ...newNoteData,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setNotes(prev => [created, ...prev]);
    showToast(`Note "${created.title}" saved!`, 'success');
    return created;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const now = new Date().toISOString();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: now } : n));
    showToast('Note updated successfully', 'info');
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast('Note moved to trash', 'warning');
  };

  // Task CRUD
  const addTask = (taskData: Omit<TaskItem, 'id' | 'completed'>) => {
    const created: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false
    };
    setTasks(prev => [created, ...prev]);
    showToast(`Task added: "${created.title}"`, 'success');
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) showToast('Task completed! 🎉', 'success');
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task removed', 'info');
  };

  // Attendance Actions
  const logAttendance = (id: string, attendedDelta: number, totalDelta: number) => {
    setAttendance(prev => prev.map(sub => {
      if (sub.id === id) {
        const newAttended = Math.max(0, sub.attended + attendedDelta);
        const newTotal = Math.max(newAttended, sub.total + totalDelta);
        const newPct = newTotal > 0 ? (newAttended / newTotal) * 100 : 100;
        
        if (newPct < sub.targetPercentage) {
          showToast(`Warning: ${sub.name} attendance dropped to ${newPct.toFixed(1)}%!`, 'alert');
        } else if (attendedDelta > 0) {
          showToast(`Logged class for ${sub.code}`, 'success');
        }

        return { ...sub, attended: newAttended, total: newTotal };
      }
      return sub;
    }));
  };

  const addSubject = (subjectData: Omit<SubjectAttendance, 'id'>) => {
    const created: SubjectAttendance = {
      ...subjectData,
      id: `att-${Date.now()}`
    };
    setAttendance(prev => [...prev, created]);
    showToast(`Added subject: ${created.name}`, 'success');
  };

  const deleteSubject = (id: string) => {
    setAttendance(prev => prev.filter(s => s.id !== id));
    showToast('Subject deleted', 'info');
  };

  // Quiz Results
  const addQuizResult = (quiz: QuizSession) => {
    setQuizzes(prev => [quiz, ...prev]);
    showToast(`Quiz result saved: ${quiz.score ?? 0}%`, 'success');
  };

  // Compute stats
  const totalAttended = attendance.reduce((acc, s) => acc + s.attended, 0);
  const totalClasses = attendance.reduce((acc, s) => acc + s.total, 0);
  const overallAttendancePct = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 100;

  const stats: UserStats = {
    notesCount: notes.length,
    tasksCount: tasks.filter(t => !t.completed).length,
    attendancePercentage: overallAttendancePct,
    studyStreakDays: getStudyStreakDays(),
    aiPromptsUsed: 14 + quizzes.length
  };

  return (
    <AppDataContext.Provider value={{
      activeModule,
      setActiveModule,
      notes,
      addNote,
      updateNote,
      deleteNote,
      tasks,
      addTask,
      toggleTaskCompleted,
      deleteTask,
      attendance,
      logAttendance,
      addSubject,
      deleteSubject,
      quizzes,
      addQuizResult,
      stats,
      toasts,
      showToast,
      removeToast,
      commandPaletteOpen,
      setCommandPaletteOpen
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
};
