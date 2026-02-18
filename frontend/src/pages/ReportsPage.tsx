import { useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";

import { api } from "../api";
import type { Child } from "../types";

type TimeRange = "last30days" | "last3months" | "thisyear" | "custom";

type ReportsPageProps = {
  selectedChild?: Child;
};

type MonthlyData = {
  month: string;
  activityCount: number;
  totalMinutes: number;
  highlight: string;
  skillBreakdown: { name: string; value: number; color: string }[];
};

const skillColors = {
  Literacy: "#5b9bd5",
  "Math & Logic": "#f2bf52",
  Creativity: "#f08452",
  Movement: "#67b587",
  "Life Skills": "#8c7ad9",
};

// Mock data for the area chart
const chartData = [
  {
    month: "April",
    Literacy: 10,
    "Math & Logic": 8,
    Creativity: 5,
    Movement: 7,
    "Life Skills": 4,
  },
  {
    month: "May 2026",
    Literacy: 15,
    "Math & Logic": 12,
    Creativity: 8,
    Movement: 10,
    "Life Skills": 6,
  },
  {
    month: "June 2026",
    Literacy: 22,
    "Math & Logic": 18,
    Creativity: 12,
    Movement: 15,
    "Life Skills": 9,
  },
];

// Mock monthly summaries
const monthlySummaries: MonthlyData[] = [
  {
    month: "March 2026",
    activityCount: 18,
    totalMinutes: 252,
    highlight: '"Read stories at the beach."',
    skillBreakdown: [
      { name: "Literacy", value: 8, color: "#5b9bd5" },
      { name: "Movement", value: 5, color: "#67b587" },
      { name: "Creativity", value: 3, color: "#f08452" },
      { name: "Life Skills", value: 2, color: "#8c7ad9" },
    ],
  },
  {
    month: "April 2026",
    activityCount: 19,
    totalMinutes: 270,
    highlight: '"Built a cardboard city together."',
    skillBreakdown: [
      { name: "Creativity", value: 7, color: "#f08452" },
      { name: "Math & Logic", value: 6, color: "#f2bf52" },
      { name: "Literacy", value: 4, color: "#5b9bd5" },
      { name: "Movement", value: 2, color: "#67b587" },
    ],
  },
  {
    month: "May 2026",
    activityCount: 11,
    totalMinutes: 165,
    highlight: '"Practice counting during snacktime."',
    skillBreakdown: [
      { name: "Math & Logic", value: 5, color: "#f2bf52" },
      { name: "Movement", value: 3, color: "#67b587" },
      { name: "Literacy", value: 2, color: "#5b9bd5" },
      { name: "Life Skills", value: 1, color: "#8c7ad9" },
    ],
  },
];

const growthHighlights = [
  "Literacy activities have been thriving the last three months",
  "Balanced exploration across 4 skill areas",
];

export function ReportsPage({ selectedChild }: ReportsPageProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("last3months");
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
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
            <Typography variant="body1" color="text.secondary" fontSize="1rem">
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
                              52{" "}
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
                              34{" "}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                fontWeight={500}
                              >
                                hrs
                              </Typography>{" "}
                              20{" "}
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
                              4{" "}
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
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient
                                  id="colorLiteracy"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#5b9bd5"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#5b9bd5"
                                    stopOpacity={0.3}
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="colorMath"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#f2bf52"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#f2bf52"
                                    stopOpacity={0.3}
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="colorCreativity"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#f08452"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#f08452"
                                    stopOpacity={0.3}
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="colorMovement"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#67b587"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#67b587"
                                    stopOpacity={0.3}
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="colorLife"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#8c7ad9"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#8c7ad9"
                                    stopOpacity={0.3}
                                  />
                                </linearGradient>
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
                              <Area
                                type="monotone"
                                dataKey="Life Skills"
                                stackId="1"
                                stroke="#8c7ad9"
                                fill="url(#colorLife)"
                              />
                              <Area
                                type="monotone"
                                dataKey="Movement"
                                stackId="1"
                                stroke="#67b587"
                                fill="url(#colorMovement)"
                              />
                              <Area
                                type="monotone"
                                dataKey="Creativity"
                                stackId="1"
                                stroke="#f08452"
                                fill="url(#colorCreativity)"
                              />
                              <Area
                                type="monotone"
                                dataKey="Math & Logic"
                                stackId="1"
                                stroke="#f2bf52"
                                fill="url(#colorMath)"
                              />
                              <Area
                                type="monotone"
                                dataKey="Literacy"
                                stackId="1"
                                stroke="#5b9bd5"
                                fill="url(#colorLiteracy)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Box>

                        {/* Legend */}
                        <Stack
                          direction="row"
                          spacing={3}
                          justifyContent="center"
                          sx={{ mt: 2 }}
                        >
                          {Object.entries(skillColors).map(([skill, color]) => (
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
                          ))}
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
                    {monthlySummaries.map((summary) => (
                      <Grid size={{ xs: 12, md: 4 }} key={summary.month}>
                        <Card sx={{ borderRadius: 2, height: "100%" }}>
                          <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="#2d3748"
                              >
                                {summary.month}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                {/* Mini Pie Chart */}
                                <Box sx={{ width: 80, height: 80 }}>
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <PieChart>
                                      <Pie
                                        data={summary.skillBreakdown}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={40}
                                        innerRadius={0}
                                        stroke="none"
                                      >
                                        {summary.skillBreakdown.map(
                                          (entry, index) => (
                                            <Cell
                                              key={`cell-${index}`}
                                              fill={entry.color}
                                            />
                                          ),
                                        )}
                                      </Pie>
                                    </PieChart>
                                  </ResponsiveContainer>
                                </Box>

                                <Box>
                                  <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="#2d3748"
                                  >
                                    {summary.activityCount} activities
                                  </Typography>
                                  <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: "50%",
                                        border: "1.5px solid",
                                        borderColor: "text.secondary",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Box
                                        component="span"
                                        sx={{
                                          width: 4,
                                          height: 6,
                                          borderRight: "1.5px solid",
                                          borderBottom: "1.5px solid",
                                          borderColor: "text.secondary",
                                          transform:
                                            "rotate(45deg) translateY(-1px)",
                                        }}
                                      />
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {Math.floor(summary.totalMinutes / 60)}-
                                      {Math.floor(summary.totalMinutes / 60) +
                                        1}
                                      {summary.totalMinutes % 60 > 30
                                        ? "½"
                                        : ""}
                                      °
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Box>

                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  color="#2d3748"
                                >
                                  Highlight:{" "}
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    fontWeight={400}
                                  >
                                    {summary.highlight}
                                  </Typography>
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
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
                        <Typography variant="body1" sx={{ fontSize: "1.5rem" }}>
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
                      {growthHighlights.map((highlight, index) => (
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
                            {highlight}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
