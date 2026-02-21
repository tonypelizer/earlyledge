import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import NatureIcon from "@mui/icons-material/Nature";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../api";
import type { Child } from "../types";

type TimeRange = "last30days" | "last3months" | "thisyear" | "custom";

type ReportsPageProps = {
  selectedChild?: Child;
};

type ReportsData = {
  total_activities: number;
  total_hours: number;
  total_minutes: number;
  activities_per_week: number;
  skill_distribution: [string, number][];
  growth_highlights: string[];
  monthly_data: { month: string; [skill: string]: number | string }[];
  time_range: string;
};

const skillColors: { [key: string]: string } = {
  Literacy: "#5b9bd5",
  Numeracy: "#f2bf52",
  Creativity: "#f08452",
  Physical: "#67b587",
  "Practical Life": "#8c7ad9",
  "Social/Emotional": "#e56399",
  "Critical Thinking": "#9c88c4",
};

export function ReportsPage({ selectedChild }: ReportsPageProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("last3months");
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch reports data when child or time range changes
  useEffect(() => {
    if (selectedChild) {
      fetchReportsData();
    }
  }, [selectedChild, timeRange]);

  const fetchReportsData = async () => {
    if (!selectedChild) return;

    setLoading(true);
    setError("");
    try {
      const response = await api.get(
        `/reports/?child_id=${selectedChild.id}&time_range=${timeRange}`,
      );
      setReportsData(response.data);
    } catch {
      setError("Could not load reports data.");
    } finally {
      setLoading(false);
    }
  };

  const downloadSnapshot = async () => {
    if (!selectedChild) {
      setError("Please select a child first.");
      return;
    }

    setError("");
    setIsGenerating(true);
    try {
      const response = await api.get(
        `/reports/monthly/?child_id=${selectedChild.id}&month=${month}`,
        {
          responseType: "blob",
        },
      );
      const url = URL.createObjectURL(response.data);
      window.open(url, "_blank");
    } catch {
      setError("Could not generate monthly snapshot.");
    } finally {
      setIsGenerating(false);
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
            Please select a child to see reports.
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
      <Container maxWidth="xl">
        <Box sx={{ px: { xs: 1, md: 2 }, pt: { xs: 2, md: 3 } }}>
          <Stack spacing={4}>
            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

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
                  Look how much you've explored together.
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                color="text.secondary"
                fontSize="1rem"
              >
                See how your child's learning has grown over time.
              </Typography>
            </Box>

            {/* Time Range Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={timeRange}
                onChange={(_, newValue) => setTimeRange(newValue)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "text.secondary",
                    minWidth: "auto",
                    px: 3,
                  },
                  "& .Mui-selected": {
                    color: "primary.main",
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label="Last 30 Days" value="last30days" />
                <Tab label="Last 3 Months" value="last3months" />
                <Tab label="This Year" value="thisyear" />
                <Tab label="Custom" value="custom" />
              </Tabs>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Stack spacing={3}>
                  {/* Skills Over Time Chart */}
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={3}>
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#2d3748"
                            sx={{ mb: 2 }}
                          >
                            Skills Over Time
                          </Typography>

                          {/* Stats */}
                          <Stack direction="row" spacing={4} sx={{ mb: 3 }}>
                            <Box>
                              <Typography
                                variant="h5"
                                fontWeight={700}
                                color="#2d3748"
                              >
                                {reportsData?.total_activities || 0}{" "}
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight={500}
                                >
                                  Activities
                                </Typography>
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="h5"
                                fontWeight={700}
                                color="#2d3748"
                              >
                                {reportsData?.total_hours || 0}{" "}
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight={500}
                                >
                                  hrs
                                </Typography>{" "}
                                {reportsData?.total_minutes || 0}{" "}
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight={500}
                                >
                                  min
                                </Typography>
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="h5"
                                fontWeight={700}
                                color="#2d3748"
                              >
                                {reportsData?.activities_per_week || 0}{" "}
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight={500}
                                >
                                  Activities per week
                                </Typography>
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Area Chart */}
                          <Box sx={{ width: "100%", height: 300 }}>
                            {reportsData?.monthly_data &&
                            reportsData.monthly_data.length > 0 ? (
                              <AreaChart
                                width={800}
                                height={300}
                                data={reportsData.monthly_data}
                              >
                                <defs>
                                  {Object.entries(skillColors).map(
                                    ([skill, color]) => (
                                      <linearGradient
                                        key={skill}
                                        id={`color${skill.replace(/[^a-zA-Z]/g, "")}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor={color}
                                          stopOpacity={0.8}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor={color}
                                          stopOpacity={0.3}
                                        />
                                      </linearGradient>
                                    ),
                                  )}
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#e0e0e0"
                                />
                                <XAxis
                                  dataKey="month"
                                  tick={{ fill: "#718096", fontSize: 12 }}
                                  tickLine={false}
                                />
                                <YAxis
                                  tick={{ fill: "#718096", fontSize: 12 }}
                                  tickLine={false}
                                />
                                <Tooltip />
                                {Object.keys(skillColors).map((skill) => (
                                  <Area
                                    key={skill}
                                    type="monotone"
                                    dataKey={skill}
                                    stackId="1"
                                    stroke={skillColors[skill]}
                                    fill={`url(#color${skill.replace(/[^a-zA-Z]/g, "")})`}
                                  />
                                ))}
                              </AreaChart>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "100%",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  No activity data available for the selected
                                  time range.
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {/* Legend */}
                          <Stack
                            direction="row"
                            spacing={3}
                            justifyContent="center"
                            sx={{ mt: 2 }}
                          >
                            {Object.entries(skillColors).map(
                              ([skill, color]) => (
                                <Stack
                                  key={skill}
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: "50%",
                                      bgcolor: color,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontSize="0.875rem"
                                  >
                                    {skill}
                                  </Typography>
                                </Stack>
                              ),
                            )}
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Monthly Summaries */}
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <NatureIcon sx={{ color: "#67b587", fontSize: 24 }} />
                      <Typography variant="body1" color="text.secondary">
                        Take a look at all you've done in the last few months.
                      </Typography>
                    </Stack>

                    <Grid container spacing={3}>
                      <Grid size={12}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          textAlign="center"
                        >
                          Detailed monthly breakdowns coming soon! For now, use
                          the chart above and download PDF reports.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Grid>

              {/* Sidebar */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Stack spacing={3}>
                  {/* Monthly Snapshot Card */}
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2} alignItems="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ alignSelf: "flex-start" }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontSize: "1.5rem" }}
                          >
                            🌅
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#2d3748"
                          >
                            Monthly Snapshot
                          </Typography>
                        </Stack>

                        {/* Illustration */}
                        <Box
                          sx={{
                            width: 180,
                            height: 120,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          {/* Simple illustration using CSS */}
                          <Box
                            sx={{
                              width: 140,
                              height: 80,
                              bgcolor: "#f2e8d5",
                              borderRadius: "50% 50% 0 0",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: -20,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                bgcolor: "#f2bf52",
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 80,
                                height: 50,
                                bgcolor: "#67b587",
                                borderRadius: "50% 50% 0 0",
                              }}
                            />
                          </Box>
                        </Box>

                        <TextField
                          label="Select Month"
                          type="month"
                          value={month}
                          onChange={(event) => setMonth(event.target.value)}
                          slotProps={{ inputLabel: { shrink: true } }}
                          fullWidth
                          size="medium"
                        />

                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<FileDownloadIcon />}
                          onClick={downloadSnapshot}
                          disabled={!selectedChild || isGenerating}
                          sx={{
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "1rem",
                          }}
                        >
                          {isGenerating
                            ? "Generating..."
                            : "Download PDF Snapshot"}
                        </Button>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize="0.875rem"
                          textAlign="center"
                        >
                          A keepsake record of{" "}
                          {selectedChild ? `${selectedChild.name}'s` : "the"}{" "}
                          activities for the selected month.
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Growth Highlights */}
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="#2d3748"
                        sx={{ mb: 2 }}
                      >
                        Growth Highlights
                      </Typography>
                      <Stack spacing={1.5}>
                        {reportsData?.growth_highlights &&
                        reportsData.growth_highlights.length > 0 ? (
                          reportsData.growth_highlights.map(
                            (highlight, index) => (
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
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {highlight}
                                </Typography>
                              </Stack>
                            ),
                          )
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Start logging activities to see growth patterns and
                            insights!
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
