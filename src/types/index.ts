export type ActiveModule = 
  | 'dashboard'
  | 'topic-explainer'
  | 'quiz-generator'
  | 'summarizer'
  | 'code-studio'
  | 'code-debugger'
  | 'app-builder'
  | 'interview-prep'
  | 'project-planner'
  | 'attendance'
  | 'notes'
  | 'tasks';

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

export type PriorityLevel = 'high' | 'medium' | 'low';
export type TaskCategory = 'Assignment' | 'Exam' | 'Project' | 'Quiz' | 'Personal';

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // ISO or YYYY-MM-DD
  priority: PriorityLevel;
  category: TaskCategory;
  completed: boolean;
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  attended: number;
  total: number;
  targetPercentage: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizSession {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: QuizQuestion[];
  userAnswers: Record<number, number>; // questionIndex -> selectedIndex
  score?: number;
  completedAt?: string;
}

export interface TopicExplanation {
  concept: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  overview: string;
  analogy: {
    title: string;
    description: string;
  };
  keyTerms: { term: string; definition: string }[];
  deepDivePoints: string[];
  codeOrFormula?: string;
  miniQuiz: QuizQuestion[];
}

export interface SummaryResult {
  title: string;
  originalTextSample: string;
  tldr: string;
  bulletPoints: string[];
  keyTakeaways: string[];
  flashcards: { question: string; answer: string }[];
  mindMapNodes: { id: string; label: string; parent?: string }[];
}

export interface CodeTranslation {
  sourceLang: string;
  targetLang: string;
  originalCode: string;
  translatedCode: string;
  explanation: string[];
}

export interface CodeDebugResult {
  language: string;
  bugCategory: 'Syntax Error' | 'Logic Bug' | 'State Mutation' | 'Performance Bottleneck' | 'Type Mismatch';
  rootCause: string;
  fixedCode: string;
  lineByLineFixes: string[];
  bestPractices: string[];
  healthScore: number;
}

export interface AppPrototypeFile {
  filename: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'json';
  content: string;
}

export interface AppPrototype {
  id: string;
  name: string;
  description: string;
  category: string;
  stack: string[];
  files: AppPrototypeFile[];
  previewHtml: string;
}

export interface InterviewQuestion {
  id: string;
  role: string;
  level: 'Junior' | 'Mid-Level' | 'Senior';
  type: 'Technical' | 'Behavioral' | 'System Design';
  question: string;
  hints: string[];
  sampleModelAnswer: string;
}

export interface InterviewFeedback {
  score: number; // 0-100
  clarityScore: number;
  technicalAccuracyScore: number;
  strengths: string[];
  missingKeywords: string[];
  improvementSuggestions: string[];
  sampleBetterAnswer: string;
}

export interface ProjectMilestone {
  phase: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  description: string;
  techStack: string[];
  architectureOverview: string;
  milestones: ProjectMilestone[];
}

export interface UserStats {
  notesCount: number;
  tasksCount: number;
  attendancePercentage: number;
  studyStreakDays: number;
  aiPromptsUsed: number;
}
