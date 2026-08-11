"use client";

import { useState } from "react";
import { Box, IconButton, Paper, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Task } from "../../hooks/useTaskStorage";

interface CreateTaskFormProps {
  onAddTask: (task: Task) => boolean;
}

export default function CreateTaskForm({ onAddTask }: Readonly<CreateTaskFormProps>) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Please enter a task title.");
      return;
    }

    const generateTaskId = () => {
      if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
        const randomValues = new Uint32Array(2);
        crypto.getRandomValues(randomValues);
        return `task-${Date.now()}-${randomValues[0].toString(16)}${randomValues[1].toString(16)}`;
      }

      return `task-${Date.now()}`;
    };

    const newTask: Task = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : generateTaskId(),
      title: trimmedTitle,
      completed: false,
    };

    const success = onAddTask(newTask);
    if (!success) {
      setError("Unable to save task. Please try again.");
      return;
    }

    setTitle("");
    setError("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "flex-end" }}>
        <TextField
          id="task-title"
          name="taskTitle"
          label="Task title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (error) {
              setError("");
            }
          }}
          error={Boolean(error)}
          helperText={error || " "}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "task-title-error" : undefined}
          fullWidth
          variant="standard"
        />
        <IconButton
          type="submit"
          color="primary"
          aria-label="Add task"
          title="Add task"
          sx={{
            alignSelf: "stretch",
            width: 56,
            height: 56,
            minWidth: 56,
            minHeight: 56,
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
