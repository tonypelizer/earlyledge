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
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          color="#2d3748"
          sx={{ mb: 2 }}
        >
          Recent Activities
        </Typography>
        <List sx={{ p: 0 }}>
          {activities.slice(0, 6).map((activity, index) => (
            <Box key={activity.id}>
              <ListItem disableGutters sx={{ py: 1.5, px: 0 }}>
                <ListItemText
                  primary={activity.title}
                  secondary={`${activity.skills.map((skill) => skill.name).join(", ") || "Unmapped"} | ${activity.duration_minutes ?? 0} min | ${activity.activity_date}`}
                  slotProps={{
                    primary: {
                      fontWeight: 600,
                      color: "#2d3748",
                      fontSize: "0.9375rem",
                    },
                    secondary: {
                      color: "text.secondary",
                      fontSize: "0.8125rem",
                    },
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
          sx={{ mt: 2, textAlign: "right", cursor: "pointer" }}
        >
          View All Activities ›
        </Typography>
      </CardContent>
    </Card>
  );
}
