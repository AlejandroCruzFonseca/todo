import { useState, useCallback } from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  [key: string]: unknown;
}

const STORAGE_KEY = "todo.tasks";

const isBrowser = () => typeof window !== "undefined" && window.localStorage !== undefined;

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const readStoredTasks = (): Task[] | null => {
  if (!isBrowser()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return safeParse<Task[]>(raw) ?? null;
  } catch {
    return null;
  }
};

const writeStoredTasks = (tasks: Task[]): boolean => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
};

const removeStoredTasks = (): boolean => {
  if (!isBrowser()) return false;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};

export const useTaskStorage = () => {
  const [state, setState] = useState(() => {
    if (!isBrowser()) return { tasks: [] as Task[], isReady: false };
    const stored = readStoredTasks();
    return { tasks: stored ?? [], isReady: true };
  });
  const { tasks, isReady } = state;

  const saveTasks = useCallback((nextTasks: Task[]) => {
    const success = writeStoredTasks(nextTasks);
    if (success) {
      setState((prev) => ({ ...prev, tasks: nextTasks }));
    }
    return success;
  }, []);

  const addTask = useCallback((task: Task) => {
    const nextTasks = [...tasks, task];
    return saveTasks(nextTasks);
  }, [tasks, saveTasks]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const nextTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task,
    );
    return saveTasks(nextTasks);
  }, [tasks, saveTasks]);

  const removeTask = useCallback((taskId: string) => {
    const nextTasks = tasks.filter((task) => task.id !== taskId);
    return saveTasks(nextTasks);
  }, [tasks, saveTasks]);

  const clearTasks = useCallback(() => {
    const success = removeStoredTasks();
    if (success) {
      setState((prev) => ({ ...prev, tasks: [] }));
    }
    return success;
  }, []);

  return {
    tasks,
    isReady,
    addTask,
    updateTask,
    removeTask,
    clearTasks,
    saveTasks,
    readStoredTasks,
    writeStoredTasks,
  };
};
