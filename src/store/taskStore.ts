import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../utils/supabase";

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
  due_date: string;
  priority: "low" | "medium" | "high";
  estimated_hours: number;
  completed: boolean;
  subtasks: Subtask[];
  created_at: string;
  user_id: string;
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

  loadTasks: () => Promise<void>;
  addTask: (task: {
    title: string;
    description: string;
    subject: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    estimatedHours: number;
  }) => Promise<void>;

  toggleTask: (taskId: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// SUBTASK GENERATION
// ---------------------------------------------------------------------------
const generateSubtasks = (estimatedHours: number): Subtask[] => {
  if (estimatedHours <= 2) return [];

  const templates = [
    "Research and gather materials",
    "Create outline or plan",
    "Complete first draft",
    "Review and revise",
    "Final check and submission prep",
  ];

  const count = Math.min(Math.ceil(estimatedHours / 2), 5);

  return Array.from({ length: count }).map((_, i) => ({
    id: crypto.randomUUID(),
    title: templates[i] || `Step ${i + 1}`,
    completed: false,
  }));
};

// ---------------------------------------------------------------------------
// BADGES
// ---------------------------------------------------------------------------
const getBadges = (completedCount: number): Badge[] => {
  const base = [
    { count: 1, name: "First Steps", icon: "🎯", description: "Completed your first task." },
    { count: 5, name: "Getting Started", icon: "⭐", description: "Completed 5 tasks." },
    { count: 10, name: "Task Master", icon: "🏆", description: "Completed 10 tasks." },
    { count: 25, name: "Productivity Pro", icon: "💎", description: "Completed 25 tasks." },
    { count: 50, name: "Achievement Hunter", icon: "👑", description: "Completed 50 tasks." },
  ];

  return base.filter((b) => completedCount >= b.count);
};

// ---------------------------------------------------------------------------
// STORE
// ---------------------------------------------------------------------------
export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      streak: 0,
      totalPoints: 0,
      badges: [],

      // ---------------------------------------------------
      // LOAD ALL TASKS FOR LOGGED-IN USER
      // ---------------------------------------------------
      loadTasks: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed loading tasks:", error);
          return;
        }

        // compute stats
        const completedCount = data.filter((t) => t.completed).length;

        set({
          tasks: data,
          totalPoints: completedCount * 10,
          badges: getBadges(completedCount),
        });
      },

      // ---------------------------------------------------
      // ADD TASK
      // ---------------------------------------------------
      addTask: async (task) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const subtasks = generateSubtasks(task.estimatedHours);

        const { data: created, error } = await supabase
          .from("tasks")
          .insert({
            user_id: user.id,
            title: task.title,
            description: task.description,
            subject: task.subject,
            priority: task.priority,
            estimated_hours: task.estimatedHours,
            due_date: task.dueDate,
            subtasks,
            completed: false,
          })
          .select()
          .single();

        if (error) {
          console.error("Failed adding task:", error);
          return;
        }

        set({ tasks: [created, ...get().tasks] });
      },

      // ---------------------------------------------------
      // TOGGLE TASK
      // ---------------------------------------------------
      toggleTask: async (taskId) => {
        const store = get();
        const task = store.tasks.find((t) => t.id === taskId);
        if (!task) return;

        const newCompleted = !task.completed;

        const { data, error } = await supabase
          .from("tasks")
          .update({
            completed: newCompleted,
            subtasks: task.subtasks.map((s) => ({ ...s, completed: newCompleted })),
          })
          .eq("id", taskId)
          .select()
          .single();

        if (error) {
          console.error("Failed updating task:", error);
          return;
        }

        const updatedTasks = store.tasks.map((t) => (t.id === taskId ? data : t));
        const completedCount = updatedTasks.filter((t) => t.completed).length;

        set({
          tasks: updatedTasks,
          totalPoints: completedCount * 10,
          badges: getBadges(completedCount),
        });
      },

      // ---------------------------------------------------
      // TOGGLE SUBTASK
      // ---------------------------------------------------
      toggleSubtask: async (taskId, subtaskId) => {
        const store = get();
        const t = store.tasks.find((x) => x.id === taskId);
        if (!t) return;

        const newSubtasks = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );

        const allDone = newSubtasks.every((s) => s.completed);

        const { data, error } = await supabase
          .from("tasks")
          .update({ subtasks: newSubtasks, completed: allDone })
          .eq("id", taskId)
          .select()
          .single();

        if (error) {
          console.error("Failed updating subtask:", error);
          return;
        }

        const updatedAll = store.tasks.map((t) => (t.id === taskId ? data : t));
        const completedCount = updatedAll.filter((t) => t.completed).length;

        set({
          tasks: updatedAll,
          totalPoints: completedCount * 10,
          badges: getBadges(completedCount),
        });
      },

      // ---------------------------------------------------
      // DELETE TASK
      // ---------------------------------------------------
      deleteTask: async (taskId) => {
        const { error } = await supabase.from("tasks").delete().eq("id", taskId);
        if (error) {
          console.error("Failed deleting task:", error);
          return;
        }

        const remaining = get().tasks.filter((t) => t.id !== taskId);
        const completedCount = remaining.filter((t) => t.completed).length;

        set({
          tasks: remaining,
          totalPoints: completedCount * 10,
          badges: getBadges(completedCount),
        });
      },
    }),
    { name: "task-store" }
  )
);
