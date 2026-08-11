"use client";

import {
  Box,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreateTaskForm from "./components/create-task-form/CreateTaskForm";
import { useTaskStorage } from "./hooks/useTaskStorage";

export default function Home() {
  const { tasks, addTask } = useTaskStorage();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "grey.100",
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Chip label="MUI-powered planner" color="primary" />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            Organize your day with MUI.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Replace scattered notes with a calm, focused space for tasks, priorities, and habits.
          </Typography>

          <Paper elevation={3} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
            <CreateTaskForm onAddTask={addTask} />
          </Paper>

          <Box aria-live="polite">
            <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
              Tasks
            </Typography>
            {tasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No tasks yet. Add your first task above.
              </Typography>
            ) : (
              <List dense>
                {tasks.map((task) => (
                  <ListItem key={task.id} disablePadding>
                    <ListItemText primary={task.title} secondary={task.completed ? "Completed" : "Pending"} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
            {["Daily planning", "Priority tracking", "Clear progress"].map((item) => (
              <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="body2">{item}</Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
