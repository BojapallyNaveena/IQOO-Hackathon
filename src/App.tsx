import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';

// Modules
import { AcademicDashboard } from './components/dashboard/AcademicDashboard';
import { TopicExplainer } from './components/study/TopicExplainer';
import { QuizGenerator } from './components/study/QuizGenerator';
import { TextSummarizer } from './components/study/TextSummarizer';
import { CodeStudio } from './components/dev/CodeStudio';
import { CodeDebugger } from './components/dev/CodeDebugger';
import { AppBuilder } from './components/dev/AppBuilder';
import { InterviewPrep } from './components/career/InterviewPrep';
import { ProjectPlanner } from './components/career/ProjectPlanner';
import { AttendanceTracker } from './components/productivity/AttendanceTracker';
import { NotesHub } from './components/productivity/NotesHub';
import { TaskManager } from './components/productivity/TaskManager';

const MainContent: React.FC = () => {
  const { activeModule } = useAppData();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <AcademicDashboard />;
      case 'topic-explainer': return <TopicExplainer />;
      case 'quiz-generator': return <QuizGenerator />;
      case 'summarizer': return <TextSummarizer />;
      case 'code-studio': return <CodeStudio />;
      case 'code-debugger': return <CodeDebugger />;
      case 'app-builder': return <AppBuilder />;
      case 'interview-prep': return <InterviewPrep />;
      case 'project-planner': return <ProjectPlanner />;
      case 'attendance': return <AttendanceTracker />;
      case 'notes': return <NotesHub />;
      case 'tasks': return <TaskManager />;
      default: return <AcademicDashboard />;
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        {renderModule()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppDataProvider>
        <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors selection:bg-brand-500 selection:text-white">
          <Sidebar />
          <MainContent />
          <CommandPalette />
          <ToastContainer />
        </div>
      </AppDataProvider>
    </ThemeProvider>
  );
}
