import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import NatureIcon from "@mui/icons-material/Nature";

type ActivitySuggestion = {
  id: number;
  title: string;
  description: string;
  skills: { name: string; color: string }[];
  duration: string;
  primaryColor: string;
};

const mockSuggestions: ActivitySuggestion[] = [
  {
    id: 1,
    title: "Count & Cook",
    description:
      'Help measure ingredients for dinner. Talk about "more", "less", and halves.',
    skills: [
      { name: "Numeracy", color: "#d4b896" },
      { name: "Life Skills", color: "#a8a8a8" },
    ],
    duration: "10-20 min",
    primaryColor: "#67b587",
  },
  {
    id: 2,
    title: "Story Swap",
    description: "Take turns adding one sentence to a silly story.",
    skills: [
      { name: "Literacy", color: "#5b9bd5" },
      { name: "Creativity", color: "#f2a154" },
    ],
    duration: "5-10 min",
    primaryColor: "#5b9bd5",
  },
  {
    id: 3,
    title: "Shape Hunt Outside",
    description: "Find circles, squares, triangles in your neighborhood.",
    skills: [
      { name: "Math & Logic", color: "#f2bf52" },
      { name: "Movement", color: "#67b587" },
    ],
    duration: "15 min",
    primaryColor: "#f08452",
  },
];

const quickSimpleIdeas = [
  "Read one page together",
  "Count the stairs in your home",
  'Ask: "What was your favorite part of today?"',
];

export function SuggestionsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <NatureIcon sx={{ color: "#67b587", fontSize: 32 }} />
              <Typography variant="h4" fontWeight={700} color="#2d3748">
                Here are some ideas you can try this week:
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" fontSize="1rem">
              This week has been rich in <strong>Creativity</strong> and{" "}
              <strong>Literacy</strong>. You might enjoy adding a little{" "}
              <strong>Movement</strong> or <strong>Numeracy</strong>.
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "text.secondary",
                },
                "& .Mui-selected": {
                  color: "primary.main",
                },
              }}
            >
              <Tab label="Suggested" />
              <Tab label="Saved" />
            </Tabs>
          </Box>

          {/* Activity Cards */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {mockSuggestions.map((suggestion) => (
                <Grid size={{ xs: 12, md: 4 }} key={suggestion.id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Stack spacing={2}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#2d3748"
                        >
                          {suggestion.title}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {suggestion.description}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          {suggestion.skills.map((skill) => (
                            <Chip
                              key={skill.name}
                              label={skill.name}
                              size="small"
                              sx={{
                                bgcolor: skill.color,
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            />
                          ))}
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {suggestion.duration}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<BookmarkBorderIcon />}
                            sx={{
                              flex: 1,
                              textTransform: "none",
                              fontWeight: 600,
                              borderColor: "#d0d0d0",
                              color: "text.primary",
                              "&:hover": {
                                borderColor: "#a0a0a0",
                                bgcolor: "rgba(0, 0, 0, 0.02)",
                              },
                            }}
                          >
                            Save for Later
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              flex: 1,
                              textTransform: "none",
                              fontWeight: 600,
                              bgcolor: suggestion.primaryColor,
                              "&:hover": {
                                bgcolor: suggestion.primaryColor,
                                opacity: 0.9,
                              },
                            }}
                          >
                            Log
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 1 && (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No saved activities yet. Click "Save for Later" on any
                suggestion to see it here.
              </Typography>
            </Box>
          )}

          {/* Quick & Simple Section */}
          <Card sx={{ borderRadius: 2, bgcolor: "#fff9f0" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" fontWeight={700} color="#2d3748">
                  👋 Quick & Simple
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {quickSimpleIdeas.map((idea, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ mt: 0.25 }}
                    >
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {idea}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
