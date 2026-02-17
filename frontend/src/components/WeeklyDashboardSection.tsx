import {
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WeeklyDashboard } from "../types";

type WeeklyDashboardSectionProps = {
  childName: string;
  dashboard: WeeklyDashboard;
};

export function WeeklyDashboardSection({
  childName,
  dashboard,
}: WeeklyDashboardSectionProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">
                Weekly dashboard for {childName}
              </Typography>
              <Typography color="text.secondary">
                Activities this week: {dashboard.activity_count}
              </Typography>
              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={dashboard.skill_counts}>
                    <XAxis
                      dataKey="skill"
                      angle={-20}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#5b7f67" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Recent activities
            </Typography>
            <List dense>
              {dashboard.recent_activities.slice(0, 6).map((activity) => (
                <ListItem key={activity.id} disablePadding>
                  <ListItemText
                    primary={activity.title}
                    secondary={`${activity.activity_date} • ${activity.skills.join(", ") || "Unmapped"}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
