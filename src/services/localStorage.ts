import type { Note, TaskItem, SubjectAttendance, QuizSession } from '../types';

const NOTES_KEY = 'edulearn_notes_v1';
const TASKS_KEY = 'edulearn_tasks_v1';
const ATTENDANCE_KEY = 'edulearn_attendance_v1';
const QUIZZES_KEY = 'edulearn_quizzes_v1';
const STREAK_KEY = 'edulearn_streak_v1';

// Seed Initial Data
const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'React 18 Concurrent Rendering & Fiber Architecture',
    subject: 'Web Development',
    content: `# React 18 Concurrent Features

## Core Concepts
1. **Automatic Batching**: Groups multiple state updates into a single re-render.
2. **Transitions**: \`useTransition\` hook marks state updates as non-urgent.
3. **Suspense for SSR**: Streaming HTML directly from the server.

\`\`\`tsx
const [isPending, startTransition] = useTransition();
startTransition(() => {
  setSearchQuery(input);
});
\`\`\`

> *Key Takeaway*: Concurrent mode allows React to interrupt rendering to handle high-priority user input.`,
    tags: ['React', 'TypeScript', 'Frontend'],
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-08-29T14:20:00Z',
    isFavorite: true
  },
  {
    id: 'note-2',
    title: 'Data Structures: Red-Black Trees & Balancing Rules',
    subject: 'Data Structures & Algorithms',
    content: `# Red-Black Tree Rules

1. Every node is either **Red** or **Black**.
2. Root is always **Black**.
3. Red nodes cannot have Red children (No double reds).
4. Every path from root to leaf has the same count of **Black** nodes.

### Rotations
- Left-Rotate around node X
- Right-Rotate around node Y`,
    tags: ['Algorithms', 'CS Core', 'Trees'],
    createdAt: '2026-08-25T11:30:00Z',
    updatedAt: '2026-08-25T11:30:00Z',
    isFavorite: false
  },
  {
    id: 'note-3',
    title: 'Machine Learning: Gradient Descent & Loss Functions',
    subject: 'Artificial Intelligence',
    content: `# Gradient Descent Optimization

Calculates gradient of cost function $J(\\theta)$ with respect to model parameters:

$$\\theta_{j} := \\theta_{j} - \\alpha \\frac{\\partial}{\\partial \\theta_{j}} J(\\theta)$$

- **Stochastic Gradient Descent (SGD)**: Fast, noisy updates.
- **Adam Optimizer**: Combines Momentum and RMSProp adaptive rates.`,
    tags: ['AI', 'Python', 'Math'],
    createdAt: '2026-08-30T09:15:00Z',
    updatedAt: '2026-08-30T09:15:00Z',
    isFavorite: true
  }
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Submit Data Structures Lab 4 (B-Trees)',
    subject: 'Data Structures & Algorithms',
    dueDate: '2026-09-02T23:59:00Z',
    priority: 'high',
    category: 'Assignment',
    completed: false
  },
  {
    id: 'task-2',
    title: 'Operating Systems Mid-term Preparation',
    subject: 'Operating Systems',
    dueDate: '2026-09-05T10:00:00Z',
    priority: 'high',
    category: 'Exam',
    completed: false
  },
  {
    id: 'task-3',
    title: 'Build EduLearn Prototype Wireframes',
    subject: 'Software Engineering',
    dueDate: '2026-09-08T18:00:00Z',
    priority: 'medium',
    category: 'Project',
    completed: true
  },
  {
    id: 'task-4',
    title: 'Read Chapter 5: Database Normalization (3NF/BCNF)',
    subject: 'Database Systems',
    dueDate: '2026-09-03T17:00:00Z',
    priority: 'low',
    category: 'Assignment',
    completed: false
  }
];

const INITIAL_ATTENDANCE: SubjectAttendance[] = [
  { id: 'att-1', code: 'CS301', name: 'Data Structures & Algorithms', attended: 26, total: 30, targetPercentage: 75 },
  { id: 'att-2', code: 'CS304', name: 'Operating Systems', attended: 20, total: 28, targetPercentage: 75 }, // 71.4% (CRITICAL)
  { id: 'att-3', code: 'CS308', name: 'Web Engineering & React', attended: 28, total: 30, targetPercentage: 75 }, // 93.3%
  { id: 'att-4', code: 'AI401', name: 'Artificial Intelligence & ML', attended: 22, total: 25, targetPercentage: 75 }, // 88%
  { id: 'att-5', code: 'MA202', name: 'Linear Algebra & Statistics', attended: 18, total: 24, targetPercentage: 75 } // 75%
];

export const loadNotesFromStorage = (): Note[] => {
  try {
    const item = localStorage.getItem(NOTES_KEY);
    return item ? JSON.parse(item) : INITIAL_NOTES;
  } catch (e) {
    return INITIAL_NOTES;
  }
};

export const saveNotesToStorage = (notes: Note[]) => {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed saving notes', e);
  }
};

export const loadTasksFromStorage = (): TaskItem[] => {
  try {
    const item = localStorage.getItem(TASKS_KEY);
    return item ? JSON.parse(item) : INITIAL_TASKS;
  } catch (e) {
    return INITIAL_TASKS;
  }
};

export const saveTasksToStorage = (tasks: TaskItem[]) => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed saving tasks', e);
  }
};

export const loadAttendanceFromStorage = (): SubjectAttendance[] => {
  try {
    const item = localStorage.getItem(ATTENDANCE_KEY);
    return item ? JSON.parse(item) : INITIAL_ATTENDANCE;
  } catch (e) {
    return INITIAL_ATTENDANCE;
  }
};

export const saveAttendanceToStorage = (attendance: SubjectAttendance[]) => {
  try {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance));
  } catch (e) {
    console.error('Failed saving attendance', e);
  }
};

export const loadQuizzesFromStorage = (): QuizSession[] => {
  try {
    const item = localStorage.getItem(QUIZZES_KEY);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    return [];
  }
};

export const saveQuizzesToStorage = (quizzes: QuizSession[]) => {
  try {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  } catch (e) {
    console.error('Failed saving quizzes', e);
  }
};

export const getStudyStreakDays = (): number => {
  try {
    const streak = localStorage.getItem(STREAK_KEY);
    return streak ? parseInt(streak, 10) : 7; // Default 7 day streak
  } catch (e) {
    return 7;
  }
};
