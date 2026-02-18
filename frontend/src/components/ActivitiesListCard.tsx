import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { Activity } from "../types";

type ActivitiesListCardProps = {
  activities: Activity[];
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (activityId: number) => void;
};

export function ActivitiesListCard({
  activities,
  onEditActivity,
  onDeleteActivity,
}: ActivitiesListCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null,
  );

  const handleDeleteClick = (activity: Activity) => {
    setActivityToDelete(activity);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (activityToDelete) {
      onDeleteActivity(activityToDelete.id);
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  return (
    <>
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
                <ListItem
                  disableGutters
                  sx={{ py: 1.5, px: 0 }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => onEditActivity(activity)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDeleteClick(activity)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  }
                >
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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Activity</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{activityToDelete?.title}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
