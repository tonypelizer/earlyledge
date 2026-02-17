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
  childName,
  dashboard,
}: WeeklyDashboardSectionProps) {
  const totalMinutes = dashboard.recent_activities.reduce(
    (sum, activity) => sum + (activity.duration_minutes ?? 0),
    0,
  );

  const palette = ["#58a9e0", "#67b587", "#f2bf52", "#f08452", "#8c7ad9"];

  return (
    <Card
      sx={{ borderRadius: 3, boxShadow: "0 8px 20px rgba(20, 35, 70, 0.06)" }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              This Week&apos;s Learning Snapshot
            </Typography>
            <Typography color="primary" variant="body2" fontWeight={600}>
              For {childName}
            </Typography>
          </Box>

          <Divider />

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="stretch"
          >
            <Box sx={{ width: { xs: "100%", md: 300 }, minWidth: 0 }}>
              <ResponsiveContainer
                width="100%"
                height={220}
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
                    outerRadius={92}
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
              spacing={1}
              flex={1}
              justifyContent="center"
              sx={{ minWidth: 180 }}
            >
              {dashboard.skill_counts.map((entry, index) => (
                <Stack
                  key={entry.skill_id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: palette[index % palette.length],
                    }}
                  />
                  <Typography variant="body2">{entry.skill}</Typography>
                </Stack>
              ))}
            </Stack>

            <Stack
              spacing={1.5}
              sx={{
                width: { xs: "100%", md: 220 },
                pl: { md: 2 },
                borderLeft: { md: "1px solid" },
                borderColor: "divider",
              }}
              justifyContent="center"
            >
              <Typography variant="h4" fontWeight={700} lineHeight={1}>
                {dashboard.activity_count}
              </Typography>
              <Typography color="text.secondary" fontWeight={600}>
                Activities Logged
              </Typography>
              <Typography variant="h4" fontWeight={700} lineHeight={1}>
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </Typography>
              <Typography color="text.secondary" fontWeight={600}>
                Total Learning Time
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
