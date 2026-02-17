import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import type { Activity } from "../types";

type ActivitiesListCardProps = {
  activities: Activity[];
};

export function ActivitiesListCard({ activities }: ActivitiesListCardProps) {
  return (
    <Card
      sx={{ borderRadius: 3, boxShadow: "0 8px 20px rgba(20, 35, 70, 0.06)" }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Recent Activities
        </Typography>
        <List sx={{ p: 0 }}>
          {activities.slice(0, 6).map((activity, index) => (
            <Box key={activity.id}>
              <ListItem disableGutters sx={{ py: 1.2 }}>
                <ListItemText
                  primary={activity.title}
                  secondary={`${activity.skills.map((skill) => skill.name).join(", ") || "Unmapped"} • ${activity.duration_minutes ?? 0} min • ${activity.activity_date}`}
                  slotProps={{
                    primary: { fontWeight: 600 },
                    secondary: { color: "text.secondary" },
                  }}
                />
              </ListItem>
              {index < Math.min(activities.length, 6) - 1 && <Divider />}
            </Box>
          ))}
        </List>
        <Typography
          variant="body2"
          color="primary"
          fontWeight={600}
          sx={{ mt: 1, textAlign: "right" }}
        >
          View all activities ›
        </Typography>
      </CardContent>
    </Card>
  );
}
