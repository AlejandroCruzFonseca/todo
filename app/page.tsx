"use client";

import { Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Home() {
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
        <Paper elevation={3} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
          <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
            <Chip label="MUI-powered planner" color="primary" />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
              Organize your day with MUI.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Replace scattered notes with a calm, focused space for tasks, priorities, and habits.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button variant="contained" size="large">
                Create task list
              </Button>
              <Button variant="outlined" size="large">
                View roadmap
              </Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
              {[
                "Daily planning",
                "Priority tracking",
                "Clear progress",
              ].map((item) => (
                <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2">{item}</Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
