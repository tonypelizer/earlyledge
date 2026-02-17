import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
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

  const palette = ["#58a9e0", "#67b587", "#f2bf52", "#f08452", "#8c7ad9"];

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
            <Box
              sx={{
                width: 240,
                height: 240,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <PieChart>
                  <Pie
                    data={dashboard.skill_counts}
                    dataKey="count"
                    nameKey="skill"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
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
              </ResponsiveContainer>
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
                  >
                    {entry.skill}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack
              spacing={2}
              sx={{
                minWidth: 200,
                pl: { md: 3 },
                borderLeft: { md: "1px solid #e2e8f0" },
              }}
              justifyContent="center"
            >
              <Box>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  lineHeight={1}
                  color="#2d3748"
                  sx={{ fontSize: "3rem" }}
                >
                  {dashboard.activity_count}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{ mt: 0.5 }}
                >
                  Activities Logged
                </Typography>
              </Box>
              <Box>
                <Stack direction="row" spacing={0.5} alignItems="baseline">
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    lineHeight={1}
                    color="#2d3748"
                    sx={{ fontSize: "3rem" }}
                  >
                    {Math.floor(totalMinutes / 60)}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#2d3748">
                    hrs
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    lineHeight={1}
                    color="#2d3748"
                    sx={{ fontSize: "3rem" }}
                  >
                    {totalMinutes % 60}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#2d3748">
                    min
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{ mt: 0.5 }}
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
