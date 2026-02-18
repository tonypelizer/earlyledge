import { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import { api } from "../api";
import type { Child } from "../types";

type PersonalizedSuggestion = {
  id: number;
  title: string;
  description: string;
  skill_name: string;
  duration_range: string;
};

type SkillAnalysis = {
  rich_skills: string[];
  missing_skills: string[];
  personalized_suggestions: PersonalizedSuggestion[];
  analysis_text: string;
  total_recent_activities: number;
};

type SuggestionsPageProps = {
  selectedChild?: Child;
  onOpenActivityModal?: (suggestion?: {
    title: string;
    description: string;
  }) => void;
};

const quickSimpleIdeas = [
  "Read one page together",
  "Count the stairs in your home",
  'Ask: "What was your favorite part of today?"',
];

export function SuggestionsPage({
  selectedChild,
  onOpenActivityModal,
}: SuggestionsPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedSuggestions, setSavedSuggestions] = useState<
    PersonalizedSuggestion[]
  >([]);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);

  // Load saved suggestions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedSuggestions");
    if (saved) {
      try {
        setSavedSuggestions(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save to localStorage whenever savedSuggestions changes
  useEffect(() => {
    localStorage.setItem("savedSuggestions", JSON.stringify(savedSuggestions));
  }, [savedSuggestions]);

  useEffect(() => {
    if (selectedChild) {
      fetchSkillAnalysis(selectedChild.id);
    }
  }, [selectedChild]);

  const saveSuggestion = (suggestion: PersonalizedSuggestion) => {
    setSavedSuggestions((prev) => {
      // Check if already saved
      if (prev.some((s) => s.id === suggestion.id)) {
        return prev;
      }
      return [...prev, suggestion];
    });
  };

  const removeSuggestion = (suggestionId: number) => {
    setSavedSuggestions((prev) => prev.filter((s) => s.id !== suggestionId));
  };

  const isSuggestionSaved = (suggestionId: number) => {
    return savedSuggestions.some((s) => s.id === suggestionId);
  };

  const getUniqueSkills = (
    suggestions: PersonalizedSuggestion[],
    skillAnalysis?: SkillAnalysis | null,
  ) => {
    const suggestionSkills = suggestions.map((s) => s.skill_name);
    const uniqueSuggestionSkills = Array.from(new Set(suggestionSkills));

    if (!skillAnalysis) {
      return uniqueSuggestionSkills.sort();
    }

    // Sort skills by priority: missing skills first (least rich), then other skills, then rich skills last
    const missingSkillsFromSuggestions = skillAnalysis.missing_skills.filter(
      (skill) => uniqueSuggestionSkills.includes(skill),
    );

    const richSkillsFromSuggestions = skillAnalysis.rich_skills.filter(
      (skill) => uniqueSuggestionSkills.includes(skill),
    );

    // Include ALL other skills that aren't categorized as rich or missing
    const otherSkills = uniqueSuggestionSkills
      .filter(
        (skill) =>
          !skillAnalysis.missing_skills.includes(skill) &&
          !skillAnalysis.rich_skills.includes(skill),
      )
      .sort();

    // Then add any missing skills that aren't in suggestions (preserve backend order)
    const otherMissingSkills = skillAnalysis.missing_skills.filter(
      (skill) => !uniqueSuggestionSkills.includes(skill),
    );

    // Finally add any rich skills that aren't in suggestions (sort these)
    const otherRichSkills = skillAnalysis.rich_skills
      .filter((skill) => !uniqueSuggestionSkills.includes(skill))
      .sort();

    // Order: missing skills first (least rich), then other skills, then rich skills last
    return [
      ...missingSkillsFromSuggestions,
      ...otherMissingSkills,
      ...otherSkills,
      ...richSkillsFromSuggestions,
      ...otherRichSkills,
    ];
  };

  const filterSuggestionsBySkill = (suggestions: PersonalizedSuggestion[]) => {
    if (skillFilter.length === 0) return suggestions;
    return suggestions.filter((s) => skillFilter.includes(s.skill_name));
  };

  const sortSuggestionsByPriority = (suggestions: PersonalizedSuggestion[]) => {
    if (!skillAnalysis) return suggestions;

    return [...suggestions].sort((a, b) => {
      const aIsMissing = skillAnalysis.missing_skills.includes(a.skill_name);
      const bIsMissing = skillAnalysis.missing_skills.includes(b.skill_name);
      const aIsRich = skillAnalysis.rich_skills.includes(a.skill_name);
      const bIsRich = skillAnalysis.rich_skills.includes(b.skill_name);

      // Missing skills first (highest priority)
      if (aIsMissing && !bIsMissing) return -1;
      if (!aIsMissing && bIsMissing) return 1;

      // Rich skills last (lowest priority)
      if (aIsRich && !bIsRich) return 1;
      if (!aIsRich && bIsRich) return -1;

      // Same priority, maintain original order
      return 0;
    });
  };

  const toggleSkillFilter = (skill: string) => {
    setSkillFilter((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const fetchSkillAnalysis = async (childId: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/skill-analysis/?child_id=${childId}`);
      setSkillAnalysis(response.data);
    } catch {
      setError("Could not load skill analysis.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedChild) {
    return (
      <Box
        sx={{ bgcolor: "#faf5f2", minHeight: "100vh", pb: { xs: 2, md: 3 } }}
      >
        <Container
          maxWidth="xl"
          sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}
        >
          <Typography variant="h5" color="text.secondary" textAlign="center">
            Please select a child to see personalized suggestions.
          </Typography>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{ bgcolor: "#faf5f2", minHeight: "100vh", pb: { xs: 2, md: 3 } }}
      >
        <Container
          maxWidth="xl"
          sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh", pb: { xs: 2, md: 3 } }}>
      <Container
        maxWidth="xl"
        sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}
      >
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Typography sx={{ fontSize: 32 }}>🌱</Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                color="#2d3748"
                sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
              >
                Some ideas for {selectedChild.name}
              </Typography>
            </Stack>
            {error ? (
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                fontSize="1rem"
              >
                {skillAnalysis?.analysis_text || "Loading analysis..."}
              </Typography>
            )}
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
            <Box>
              {/* Skill Filter */}
              {skillAnalysis?.personalized_suggestions.length ? (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Filter by skills:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {getUniqueSkills(
                      skillAnalysis.personalized_suggestions,
                      skillAnalysis,
                    ).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onClick={() => toggleSkillFilter(skill)}
                        variant={
                          skillFilter.includes(skill) ? "filled" : "outlined"
                        }
                        sx={{
                          cursor: "pointer",
                          ...(skillFilter.includes(skill)
                            ? {
                                bgcolor: "#67b587",
                                color: "#fff",
                                "&:hover": {
                                  bgcolor: "#5a9a74",
                                },
                              }
                            : {
                                borderColor: "#d0d0d0",
                                color: "text.primary",
                                "&:hover": {
                                  bgcolor: "rgba(103, 181, 135, 0.1)",
                                },
                              }),
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              ) : null}

              <Grid container spacing={3}>
                {skillAnalysis?.personalized_suggestions.length ? (
                  filterSuggestionsBySkill(
                    sortSuggestionsByPriority(
                      skillAnalysis.personalized_suggestions,
                    ),
                  ).length > 0 ? (
                    filterSuggestionsBySkill(
                      sortSuggestionsByPriority(
                        skillAnalysis.personalized_suggestions,
                      ),
                    ).map((suggestion) => (
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

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {suggestion.description}
                              </Typography>

                              <Chip
                                label={suggestion.skill_name}
                                size="small"
                                sx={{
                                  bgcolor: "#67b587",
                                  color: "#fff",
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                  alignSelf: "flex-start",
                                }}
                              />

                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                              >
                                <AccessTimeIcon
                                  sx={{ fontSize: 16, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Ages {suggestion.duration_range}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                spacing={1.5}
                                sx={{ mt: 2 }}
                              >
                                <Button
                                  variant={
                                    isSuggestionSaved(suggestion.id)
                                      ? "contained"
                                      : "outlined"
                                  }
                                  startIcon={<BookmarkBorderIcon />}
                                  onClick={() => saveSuggestion(suggestion)}
                                  disabled={isSuggestionSaved(suggestion.id)}
                                  sx={{
                                    flex: 1,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    ...(isSuggestionSaved(suggestion.id)
                                      ? {
                                          bgcolor: "#67b587",
                                          color: "#fff",
                                          "&:hover": {
                                            bgcolor: "#5a9a74",
                                          },
                                        }
                                      : {
                                          borderColor: "#d0d0d0",
                                          color: "text.primary",
                                          "&:hover": {
                                            borderColor: "#a0a0a0",
                                            bgcolor: "rgba(0, 0, 0, 0.02)",
                                          },
                                        }),
                                  }}
                                >
                                  {isSuggestionSaved(suggestion.id)
                                    ? "Saved"
                                    : "Save for Later"}
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    onOpenActivityModal?.({
                                      title: suggestion.title,
                                      description: suggestion.description,
                                    });
                                  }}
                                  sx={{
                                    flex: 1,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    bgcolor: "#67b587",
                                    "&:hover": {
                                      bgcolor: "#5a9a74",
                                    },
                                  }}
                                >
                                  Log Activity
                                </Button>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid size={12}>
                      <Box sx={{ py: 8, textAlign: "center" }}>
                        <Typography variant="h6" color="text.secondary">
                          No suggestions found for the selected skills. Try
                          selecting different skill categories or clear the
                          filters.
                        </Typography>
                      </Box>
                    </Grid>
                  )
                ) : (
                  <Grid size={12}>
                    <Box sx={{ py: 8, textAlign: "center" }}>
                      <Typography variant="h6" color="text.secondary">
                        {skillAnalysis?.total_recent_activities === 0
                          ? "No recent activities found. Add some activities to get personalized suggestions!"
                          : "Great job covering all skill areas recently! Keep up the balanced learning."}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {/* Skill Filter for Saved */}
              {savedSuggestions.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Filter by skills:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {getUniqueSkills(savedSuggestions, null).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onClick={() => toggleSkillFilter(skill)}
                        variant={
                          skillFilter.includes(skill) ? "filled" : "outlined"
                        }
                        sx={{
                          cursor: "pointer",
                          ...(skillFilter.includes(skill)
                            ? {
                                bgcolor: "#67b587",
                                color: "#fff",
                                "&:hover": {
                                  bgcolor: "#5a9a74",
                                },
                              }
                            : {
                                borderColor: "#d0d0d0",
                                color: "text.primary",
                                "&:hover": {
                                  bgcolor: "rgba(103, 181, 135, 0.1)",
                                },
                              }),
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Grid container spacing={3}>
                {savedSuggestions.length > 0 ? (
                  filterSuggestionsBySkill(savedSuggestions).length > 0 ? (
                    filterSuggestionsBySkill(savedSuggestions).map(
                      (suggestion) => (
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

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {suggestion.description}
                                </Typography>

                                <Chip
                                  label={suggestion.skill_name}
                                  size="small"
                                  sx={{
                                    bgcolor: "#67b587",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    alignSelf: "flex-start",
                                  }}
                                />

                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                >
                                  <AccessTimeIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "text.secondary",
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Ages {suggestion.duration_range}
                                  </Typography>
                                </Stack>

                                <Stack
                                  direction="row"
                                  spacing={1.5}
                                  sx={{ mt: 2 }}
                                >
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() =>
                                      removeSuggestion(suggestion.id)
                                    }
                                    sx={{
                                      flex: 1,
                                      textTransform: "none",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Remove
                                  </Button>
                                  <Button
                                    variant="contained"
                                    onClick={() => {
                                      onOpenActivityModal?.({
                                        title: suggestion.title,
                                        description: suggestion.description,
                                      });
                                    }}
                                    sx={{
                                      flex: 1,
                                      textTransform: "none",
                                      fontWeight: 600,
                                      bgcolor: "#67b587",
                                      "&:hover": {
                                        bgcolor: "#5a9a74",
                                      },
                                    }}
                                  >
                                    Log Activity
                                  </Button>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ),
                    )
                  ) : (
                    <Grid size={12}>
                      <Box sx={{ py: 8, textAlign: "center" }}>
                        <Typography variant="h6" color="text.secondary">
                          No saved suggestions found for the selected skills.
                          Try selecting different skill categories or clear the
                          filters.
                        </Typography>
                      </Box>
                    </Grid>
                  )
                ) : (
                  <Grid size={12}>
                    <Box sx={{ py: 8, textAlign: "center" }}>
                      <Typography variant="h6" color="text.secondary">
                        No saved activities yet. Click "Save for Later" on any
                        suggestion to see it here.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
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
