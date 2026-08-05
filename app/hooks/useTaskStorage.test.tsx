import { render, waitFor, act } from "@testing-library/react";
import React from "react";
import { useTaskStorage, Task } from "./useTaskStorage";

const sampleTasks: Task[] = [
  { id: "1", title: "Task 1", completed: false },
  { id: "2", title: "Task 2", completed: true },
];

describe("useTaskStorage", () => {
  let result: ReturnType<typeof useTaskStorage> | null = null;

  const TestComponent = () => {
    result = useTaskStorage();
    return <span>hook test</span>;
  };

  beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
    result = null;
  });

  it("initializes with tasks from localStorage when available", async () => {
    window.localStorage.setItem("todo.tasks", JSON.stringify(sampleTasks));

    render(<TestComponent />);

    await waitFor(() => {
      expect(result).not.toBeNull();
      expect(result?.tasks).toEqual(sampleTasks);
      expect(result?.isReady).toBe(true);
    });
  });

  it("returns false from saveTasks when localStorage write fails", async () => {
    render(<TestComponent />);

    const storageProto = Object.getPrototypeOf(window.localStorage);
    jest.spyOn(storageProto, "setItem").mockImplementation(() => {
      throw new Error("Quota exceeded");
    });

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    act(() => {
      const success = result!.saveTasks(sampleTasks);
      expect(success).toBe(false);
    });

    expect(result?.tasks).toEqual([]);
  });

  it("saveTasks persists tasks and returns true", async () => {
    render(<TestComponent />);

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    act(() => {
      expect(result!.saveTasks(sampleTasks)).toBe(true);
    });

    expect(JSON.parse(window.localStorage.getItem("todo.tasks")!)).toEqual(sampleTasks);
    expect(result?.tasks).toEqual(sampleTasks);
  });

  it("addTask appends a task and persists storage", async () => {
    window.localStorage.setItem("todo.tasks", JSON.stringify(sampleTasks));
    render(<TestComponent />);

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    const newTask: Task = { id: "3", title: "Task 3", completed: false };

    act(() => {
      expect(result!.addTask(newTask)).toBe(true);
    });

    expect(result?.tasks).toEqual([...sampleTasks, newTask]);
    expect(JSON.parse(window.localStorage.getItem("todo.tasks")!)).toEqual([
      ...sampleTasks,
      newTask,
    ]);
  });

  it("updateTask modifies the matching task and persists", async () => {
    window.localStorage.setItem("todo.tasks", JSON.stringify(sampleTasks));
    render(<TestComponent />);

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    act(() => {
      expect(result!.updateTask("1", { completed: true })).toBe(true);
    });

    expect(result?.tasks).toEqual([
      { id: "1", title: "Task 1", completed: true },
      sampleTasks[1],
    ]);
    expect(JSON.parse(window.localStorage.getItem("todo.tasks")!)).toEqual(result?.tasks);
  });

  it("removeTask filters the task and persists", async () => {
    window.localStorage.setItem("todo.tasks", JSON.stringify(sampleTasks));
    render(<TestComponent />);

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    act(() => {
      expect(result!.removeTask("1")).toBe(true);
    });

    expect(result?.tasks).toEqual([sampleTasks[1]]);
    expect(JSON.parse(window.localStorage.getItem("todo.tasks")!)).toEqual([sampleTasks[1]]);
  });

  it("clearTasks removes stored values and empties the list", async () => {
    window.localStorage.setItem("todo.tasks", JSON.stringify(sampleTasks));
    render(<TestComponent />);

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    act(() => {
      expect(result!.clearTasks()).toBe(true);
    });

    expect(result?.tasks).toEqual([]);
    expect(window.localStorage.getItem("todo.tasks")).toBeNull();
  });

  it("returns false from clearTasks when localStorage removal fails", async () => {
    window.localStorage.setItem("todo.tasks", JSON.stringify(sampleTasks));
    render(<TestComponent />);

    const storageProto = Object.getPrototypeOf(window.localStorage);
    jest.spyOn(storageProto, "removeItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    act(() => {
      expect(result!.clearTasks()).toBe(false);
    });

    expect(result?.tasks).toEqual(sampleTasks);
    expect(JSON.parse(window.localStorage.getItem("todo.tasks")!)).toEqual(sampleTasks);
  });

  it("readStoredTasks returns null when no task entry exists", async () => {
    render(<TestComponent />);

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    act(() => {
      expect(result!.readStoredTasks()).toBeNull();
    });
  });

  it("returns null from readStoredTasks when localStorage read fails", async () => {
    window.localStorage.setItem("todo.tasks", "not-json");
    render(<TestComponent />);

    const storageProto = Object.getPrototypeOf(window.localStorage);
    jest.spyOn(storageProto, "getItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    await waitFor(() => {
      expect(result).not.toBeNull();
    });

    act(() => {
      const tasks = result!.readStoredTasks();
      expect(tasks).toBeNull();
    });
  });

  it("handles unavailable browser storage gracefully", async () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");

    Object.defineProperty(window, "localStorage", {
      value: undefined,
      configurable: true,
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(result).not.toBeNull();
      expect(result?.tasks).toEqual([]);
      expect(result?.isReady).toBe(false);
    });

    act(() => {
      expect(result!.readStoredTasks()).toBeNull();
      expect(result!.writeStoredTasks(sampleTasks)).toBe(false);
      expect(result!.clearTasks()).toBe(false);
    });

    if (originalDescriptor) {
      Object.defineProperty(window, "localStorage", originalDescriptor);
    }
  });
});
