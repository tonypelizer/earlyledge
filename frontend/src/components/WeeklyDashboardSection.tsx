import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { WeeklyDashboard } from "../types";

type WeeklyDashboardSectionProps = {
  childName: string;
  dashboard: WeeklyDashboard;
};

export function WeeklyDashboardSection({
  childName: _childName,
  dashboard,
}: WeeklyDashboardSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const totalMinutes = dashboard.recent_activities.reduce(
    (sum, activity) => sum + (activity.duration_minutes ?? 0),
    0,
  );

  // Calculate current week date range (Sunday to Saturday)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  };

  const dateRange = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

  const palette = [
    "#58a9e0", // Blue
    "#67b587", // Green
    "#f2bf52", // Yellow
    "#f08452", // Orange
    "#8c7ad9", // Purple
    "#e85a8a", // Pink
    "#4db6ac", // Teal
    "#a1887f", // Brown
    "#ff7043", // Deep Orange
    "#9c27b0", // Deep Purple
    "#2196f3", // Light Blue
    "#795548", // Dark Brown
  ];

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              color="#2d3748"
              sx={{ mb: 0.5 }}
            >
              This Week&apos;s Learning Snapshot
            </Typography>
            <Typography color="primary" variant="body2" fontWeight={500}>
              {dateRange}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="center"
          >
            {/* Pie Chart and Skills - side by side on mobile, separate on desktop */}
            <Stack
              direction={{ xs: "row", md: "row" }}
              spacing={{ xs: 2, md: 0 }}
              alignItems="center"
              sx={{
                flex: { md: 1 },
                width: { xs: "100%", md: "auto" },
              }}
            >
              {/* Pie Chart */}
              <Box
                sx={{
                  width: { xs: 160, md: 240 },
                  height: { xs: 160, md: 240 },
                  minWidth: { xs: 160, md: 240 },
                  minHeight: { xs: 160, md: 240 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mr: { md: 3 },
                }}
              >
                <PieChart
                  width={isMobile ? 160 : 240}
                  height={isMobile ? 160 : 240}
                >
                  <Pie
                    data={dashboard.skill_counts}
                    dataKey="count"
                    nameKey="skill"
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 70 : 100}
                    innerRadius={0}
                    stroke="none"
                  >
                    {dashboard.skill_counts.map((entry, index) => (
                      <Cell
                        key={`${entry.skill}-${entry.skill_id}`}
                        fill={palette[index % palette.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </Box>

              <Stack
                spacing={1.5}
                flex={1}
                justifyContent="center"
                sx={{ minWidth: 160 }}
              >
                {dashboard.skill_counts.map((entry, index) => (
                  <Stack
                    key={entry.skill_id}
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        bgcolor: palette[index % palette.length],
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.primary"
                      sx={{
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                      }}
                    >
                      {entry.skill}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Stack
              direction={{ xs: "row", md: "column" }}
              spacing={2}
              sx={{
                minWidth: 200,
                pl: { md: 3 },
                borderLeft: { md: "1px solid #e2e8f0" },
              }}
              justifyContent="center"
            >
              <Box sx={{ flex: { xs: 1, md: "none" }, textAlign: "center" }}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  lineHeight={1}
                  color="#2d3748"
                  sx={{
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  {dashboard.activity_count}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  Activities Logged
                </Typography>
              </Box>
              <Box sx={{ flex: { xs: 1, md: "none" }, textAlign: "center" }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="baseline"
                  sx={{ justifyContent: "center" }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    lineHeight={1}
                    color="#2d3748"
                    sx={{
                      fontSize: { xs: "1.5rem", md: "3rem" },
                    }}
                  >
                    {Math.floor(totalMinutes / 60)}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#2d3748"
                    sx={{
                      fontSize: { xs: "0.875rem", md: "1.25rem" },
                    }}
                  >
                    hrs
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    lineHeight={1}
                    color="#2d3748"
                    sx={{
                      fontSize: { xs: "1.5rem", md: "3rem" },
                    }}
                  >
                    {totalMinutes % 60}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#2d3748"
                    sx={{
                      fontSize: { xs: "0.875rem", md: "1.25rem" },
                    }}
                  >
                    min
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: "0.75rem", md: "0.875rem" },
                  }}
                >
                  Total Learning Time
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
