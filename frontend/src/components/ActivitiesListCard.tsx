import {
  Card,
  CardContent,
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
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          All logged activities
        </Typography>
        <List>
          {activities.slice(0, 12).map((activity) => (
            <ListItem key={activity.id}>
              <ListItemText
                primary={activity.title}
                secondary={`${activity.activity_date} • ${activity.skills.map((skill) => skill.name).join(", ") || "Unmapped"}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
