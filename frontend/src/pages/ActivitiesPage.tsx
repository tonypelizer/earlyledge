import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NatureIcon from "@mui/icons-material/Nature";

import { api } from "../api";
import { ActivityModal } from "../components/ActivityModal";
import type { Activity, Child, Skill } from "../types";

type ActivitiesPageProps = {
  selectedChild?: Child;
};

export function ActivitiesPage({ selectedChild }: ActivitiesPageProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [activities, setActivities] = useState<Activity[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null,
  );

  // Activity modal state
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<number | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | "">("");
  const [activityDate, setActivityDate] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);

  const activitiesPerPage = 20;

  useEffect(() => {
    if (selectedChild) {
      fetchActivities();
      fetchSkills();
    }
  }, [selectedChild, page]);

  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills/");
      setSkills(response.data);
    } catch {
      // Silently fail - skills are not critical for viewing activities
    }
  };

  const fetchActivities = async () => {
    if (!selectedChild) return;

    setLoading(true);
    setError("");
    try {
      const response = await api.get(
        `/activities/?child_id=${selectedChild.id}`,
      );
      const allActivities = response.data;

      // Client-side pagination
      const startIndex = (page - 1) * activitiesPerPage;
      const endIndex = startIndex + activitiesPerPage;
      const paginatedActivities = allActivities.slice(startIndex, endIndex);

      setActivities(paginatedActivities);
      setTotalPages(Math.ceil(allActivities.length / activitiesPerPage));
    } catch {
      setError("Could not load activities.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setTitle(activity.title);
    setNotes(activity.notes || "");
    setDurationMinutes(activity.duration_minutes || "");
    setActivityDate(activity.activity_date);
    setSelectedSkillIds(activity.skills.map((skill) => skill.id));
    setActivityModalOpen(true);
  };

  const updateActivity = async () => {
    if (!selectedChild || !editingActivityId) return;

    try {
      await api.put(`/activities/${editingActivityId}/`, {
        child: selectedChild.id,
        title,
        notes,
        duration_minutes: durationMinutes || null,
        activity_date: activityDate,
        skill_ids: selectedSkillIds,
      });

      setActivityModalOpen(false);
      cancelEditActivity();
      fetchActivities(); // Refresh the list
    } catch {
      setError("Could not update activity.");
    }
  };

  const deleteActivity = async (activityId: number) => {
    try {
      await api.delete(`/activities/${activityId}/`);
      fetchActivities(); // Refresh the list
    } catch {
      setError("Could not delete activity.");
    }
  };

  const cancelEditActivity = () => {
    setEditingActivityId(null);
    setTitle("");
    setNotes("");
    setDurationMinutes("");
    setActivityDate("");
    setSelectedSkillIds([]);
  };

  const onSkillToggle = (skillId: number) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId],
    );
  };

  const handleDeleteClick = (activity: Activity) => {
    setActivityToDelete(activity);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (activityToDelete) {
      deleteActivity(activityToDelete.id);
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setActivityToDelete(null);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
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
            Please select a child to see their activities.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh", pb: { xs: 2, md: 3 } }}>
      <Container
        maxWidth="xl"
        sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}
      >
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
                All Activities for {selectedChild.name}
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" fontSize="1rem">
              A complete record of all logged activities and learning moments.
            </Typography>
          </Box>

          {/* Activities List */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                color="#2d3748"
                sx={{ mb: 2 }}
              >
                Activities ({activities.length} of many)
              </Typography>

              {loading ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    Loading activities...
                  </Typography>
                </Box>
              ) : activities.length > 0 ? (
                <>
                  <List sx={{ p: 0 }}>
                    {activities.map((activity, index) => (
                      <Box key={activity.id}>
                        <ListItem
                          disableGutters
                          sx={{ py: 2, px: 0 }}
                          secondaryAction={
                            <Stack
                              direction="row"
                              spacing={0.5}
                              sx={{
                                transform: "translateY(-100%)",
                              }}
                            >
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={() => handleEditActivity(activity)}
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
                            secondary={
                              isMobile ? (
                                <Stack spacing={0.5}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontSize="0.8125rem"
                                  >
                                    {activity.skills
                                      .map((skill) => skill.name)
                                      .join(", ") || "Unmapped"}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontSize="0.8125rem"
                                  >
                                    {activity.duration_minutes ?? 0} min •{" "}
                                    {activity.activity_date}
                                  </Typography>
                                  {activity.notes && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      fontSize="0.75rem"
                                      sx={{ fontStyle: "italic" }}
                                    >
                                      "{activity.notes}"
                                    </Typography>
                                  )}
                                </Stack>
                              ) : (
                                <Stack spacing={0.5}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    fontSize="0.8125rem"
                                  >
                                    {activity.skills
                                      .map((skill) => skill.name)
                                      .join(", ") || "Unmapped"}{" "}
                                    | {activity.duration_minutes ?? 0} min |{" "}
                                    {activity.activity_date}
                                  </Typography>
                                  {activity.notes && (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      fontSize="0.75rem"
                                      sx={{ fontStyle: "italic" }}
                                    >
                                      "{activity.notes}"
                                    </Typography>
                                  )}
                                </Stack>
                              )
                            }
                            slotProps={{
                              primary: {
                                fontWeight: 600,
                                color: "#2d3748",
                                fontSize: "0.9375rem",
                              },
                            }}
                          />
                        </ListItem>
                        {index < activities.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                    >
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    No activities found for {selectedChild.name}.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Start logging activities to see them here!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* Delete Confirmation Dialog */}
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

      {/* Activity Edit Modal */}
      <ActivityModal
        open={activityModalOpen}
        title={title}
        notes={notes}
        durationMinutes={durationMinutes}
        activityDate={activityDate}
        selectedSkillIds={selectedSkillIds}
        skills={skills}
        isEditing={editingActivityId !== null}
        onTitleChange={setTitle}
        onNotesChange={setNotes}
        onDurationChange={setDurationMinutes}
        onActivityDateChange={setActivityDate}
        onSkillToggle={onSkillToggle}
        onSave={updateActivity}
        onCancel={() => {
          setActivityModalOpen(false);
          cancelEditActivity();
        }}
      />
    </Box>
  );
}
