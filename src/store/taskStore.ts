import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: string;
}

export interface Badge {
  name: string;
  description: string;
  icon: string;
}

interface TaskStore {
  tasks: Task[];
  streak: number;
  totalPoints: number;
  badges: Badge[];
  addTask: (taskData: Omit<Task, 'id' | 'completed' | 'subtasks' | 'createdAt'>) => void;
  toggleTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (taskId: string) => void;
}

// Generate subtasks based on estimated hours
const generateSubtasks = (title: string, estimatedHours: number): Subtask[] => {
  if (estimatedHours <= 2) return [];
  
  const subtaskCount = Math.min(Math.ceil(estimatedHours / 2), 5);
  const subtasks: Subtask[] = [];
  
  const subtaskTemplates = [
    'Research and gather materials',
    'Create outline or plan',
    'Complete first draft',
    'Review and revise',
    'Final check and submission prep',
  ];
  
  for (let i = 0; i < subtaskCount; i++) {
    subtasks.push({
      id: `subtask-${Date.now()}-${i}`,
      title: subtaskTemplates[i] || `Part ${i + 1}`,
      completed: false,
    });
  }
  
  return subtasks;
};

// Check and award badges
const checkBadges = (tasks: Task[], currentBadges: Badge[]): Badge[] => {
  const newBadges: Badge[] = [...currentBadges];
  const completedTasks = tasks.filter(t => t.completed).length;
  
  const badgeChecks = [
    { count: 1, name: 'First Steps', description: 'Complete your first task', icon: '🎯' },
    { count: 5, name: 'Getting Started', description: 'Complete 5 tasks', icon: '⭐' },
    { count: 10, name: 'Task Master', description: 'Complete 10 tasks', icon: '🏆' },
    { count: 25, name: 'Productivity Pro', description: 'Complete 25 tasks', icon: '💎' },
    { count: 50, name: 'Achievement Hunter', description: 'Complete 50 tasks', icon: '👑' },
  ];
  
  badgeChecks.forEach(badge => {
    if (completedTasks >= badge.count && !newBadges.some(b => b.name === badge.name)) {
      newBadges.push(badge);
    }
  });
  
  return newBadges;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: '1',
          title: 'Complete Math Assignment Chapter 5',
          description: 'Solve problems 1-20 from calculus textbook',
          subject: 'Mathematics',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          estimatedHours: 4,
          completed: false,
          subtasks: [
            { id: 'st1', title: 'Review chapter concepts', completed: true },
            { id: 'st2', title: 'Solve problems 1-10', completed: false },
            { id: 'st3', title: 'Solve problems 11-20', completed: false },
            { id: 'st4', title: 'Review and check answers', completed: false },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'History Essay Draft',
          description: 'Write 1500 words on Industrial Revolution',
          subject: 'History',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'medium',
          estimatedHours: 6,
          completed: false,
          subtasks: [
            { id: 'st5', title: 'Research sources', completed: true },
            { id: 'st6', title: 'Create outline', completed: true },
            { id: 'st7', title: 'Write introduction', completed: false },
            { id: 'st8', title: 'Write body paragraphs', completed: false },
            { id: 'st9', title: 'Write conclusion', completed: false },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Science Lab Report',
          description: 'Document findings from chemistry experiment',
          subject: 'Chemistry',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'high',
          estimatedHours: 3,
          completed: false,
          subtasks: [
            { id: 'st10', title: 'Organize experimental data', completed: true },
            { id: 'st11', title: 'Write methodology section', completed: false },
            { id: 'st12', title: 'Analyze results', completed: false },
          ],
          createdAt: new Date().toISOString(),
        },
      ],
      streak: 7,
      totalPoints: 450,
      badges: [
        { name: 'First Steps', description: 'Complete your first task', icon: '🎯' },
        { name: 'Getting Started', description: 'Complete 5 tasks', icon: '⭐' },
      ],

      addTask: (taskData) =>
        set((state) => {
          const subtasks = generateSubtasks(taskData.title, taskData.estimatedHours);
          const newTask: Task = {
            ...taskData,
            id: `task-${Date.now()}`,
            completed: false,
            subtasks,
            createdAt: new Date().toISOString(),
          };
          return { tasks: [...state.tasks, newTask] };
        }),

      toggleTask: (taskId) =>
        set((state) => {
          const updatedTasks = state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed: !task.completed,
                  subtasks: task.subtasks.map(st => ({ ...st, completed: !task.completed })),
                }
              : task
          );
          
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const pointsPerTask = 10;
          const newPoints = state.totalPoints + (updatedTasks.find(t => t.id === taskId)?.completed ? pointsPerTask : -pointsPerTask);
          const newBadges = checkBadges(updatedTasks, state.badges);
          
          return {
            tasks: updatedTasks,
            totalPoints: Math.max(0, newPoints),
            badges: newBadges,
          };
        }),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => {
          const updatedTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              const updatedSubtasks = task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              );
              const allSubtasksCompleted = updatedSubtasks.every(st => st.completed);
              return {
                ...task,
                subtasks: updatedSubtasks,
                completed: allSubtasksCompleted && updatedSubtasks.length > 0,
              };
            }
            return task;
          });
          
          return { tasks: updatedTasks };
        }),

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
    }),
    {
      name: 'chrono-task-storage',
    }
  )
);
