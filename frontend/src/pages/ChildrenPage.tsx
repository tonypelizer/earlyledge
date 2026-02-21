import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CakeIcon from "@mui/icons-material/Cake";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { UpgradeBanner } from "../components/UpgradeBanner";
import type { Child } from "../types";

type ChildrenPageProps = {
  children: Child[];
  selectedChildId: number | "";
  childNameInput: string;
  childDateOfBirthInput: string;
  isEditingChild: boolean;
  onSelectedChildChange: (childId: number) => void;
  onChildNameChange: (name: string) => void;
  onChildDateOfBirthChange: (date: string) => void;
  onAddChild: () => void;
  onStartEditChild: () => void;
  onUpdateChild: () => void;
  onCancelEdit: () => void;
  onDeleteChild: () => void;
  isPlus?: boolean;
  maxChildren?: number;
  childCount?: number;
  onNavigateToPricing?: () => void;
};

// ---------------------------------------------------------------------------
// Child avatar — first letter + calm colour
// ---------------------------------------------------------------------------
const avatarColors = ["#5b9bd5", "#67b587", "#cd975c", "#8c7ad9", "#e56399"];

function ChildAvatar({ name, index }: { name: string; index: number }) {
  return (
    <Avatar
      sx={{
        width: 48,
        height: 48,
        bgcolor: avatarColors[index % avatarColors.length],
        fontWeight: 600,
        fontSize: "1.125rem",
      }}
    >
      {name.charAt(0).toUpperCase()}
    </Avatar>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export function ChildrenPage({
  children: childrenList,
  selectedChildId,
  childNameInput,
  childDateOfBirthInput,
  isEditingChild,
  onSelectedChildChange,
  onChildNameChange,
  onChildDateOfBirthChange,
  onAddChild,
  onStartEditChild,
  onUpdateChild,
  onCancelEdit,
  onDeleteChild,
  isPlus = false,
  maxChildren = 1,
  childCount = 0,
  onNavigateToPricing,
}: ChildrenPageProps) {
  const atLimit = childCount >= maxChildren;

  // Local dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);

  // -----------------------------------------------------------------------
  // Dialog helpers
  // -----------------------------------------------------------------------
  const openAddDialog = () => {
    onChildNameChange("");
    onChildDateOfBirthChange("");
    onCancelEdit();
    setAddDialogOpen(true);
  };

  const openEditDialog = (child: Child) => {
    onSelectedChildChange(child.id);
    onChildNameChange(child.name);
    onChildDateOfBirthChange(child.date_of_birth);
    onStartEditChild();
    setAddDialogOpen(true);
  };

  const handleSave = () => {
    if (isEditingChild) {
      onUpdateChild();
    } else {
      onAddChild();
    }
    setAddDialogOpen(false);
  };

  const handleCancel = () => {
    onCancelEdit();
    setAddDialogOpen(false);
  };

  const openDeleteDialog = (child: Child) => {
    setChildToDelete(child);
    onSelectedChildChange(child.id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDeleteChild();
    setDeleteDialogOpen(false);
    setChildToDelete(null);
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh", pb: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ pt: { xs: 3, md: 4 }, px: { xs: 1, md: 2 } }}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} color="#2d3748">
                Child Profiles
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {childCount === 0
                  ? "Add your first child to get started."
                  : `${childCount} of ${maxChildren} profile${maxChildren > 1 ? "s" : ""} used`}
              </Typography>
            </Box>
            {childCount > 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddDialog}
                disabled={atLimit && !isPlus}
                sx={{
                  bgcolor: "#67b587",
                  "&:hover": { bgcolor: "#5a9a74" },
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Add Child
              </Button>
            )}
          </Stack>

          {/* Usage bar */}
          {childCount > 0 && (
            <LinearProgress
              variant="determinate"
              value={(childCount / maxChildren) * 100}
              sx={{
                height: 4,
                borderRadius: 2,
                mb: 3,
                bgcolor: "#e8f0e8",
                "& .MuiLinearProgress-bar": {
                  bgcolor: childCount >= maxChildren ? "#e57373" : "#67b587",
                  borderRadius: 2,
                },
              }}
            />
          )}

          {/* Upgrade banner at limit */}
          {atLimit && !isPlus && (
            <Box sx={{ mb: 3 }}>
              <UpgradeBanner
                message={`Your Free plan supports ${maxChildren} child profile.`}
                description="Upgrade to Plus to add up to 5 child profiles and unlock the full learning story."
                onUpgrade={onNavigateToPricing}
                ctaLabel="See Plus plan"
                compact
              />
            </Box>
          )}

          {/* --------------------------------------------------------------- */}
          {/* Empty state                                                      */}
          {/* --------------------------------------------------------------- */}
          {childCount === 0 && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ py: { xs: 6, md: 8 }, textAlign: "center" }}>
                <ChildCareIcon
                  sx={{ fontSize: 56, color: "#67b587", opacity: 0.8, mb: 2 }}
                />
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="#2d3748"
                  sx={{ mb: 1 }}
                >
                  No children yet
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, maxWidth: 380, mx: "auto" }}
                >
                  Add your child's name and date of birth to start tracking
                  their learning journey.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openAddDialog}
                  sx={{
                    bgcolor: "#67b587",
                    "&:hover": { bgcolor: "#5a9a74" },
                    fontWeight: 600,
                    px: 4,
                    py: 1.25,
                    borderRadius: 2,
                  }}
                >
                  Add your first child
                </Button>
              </CardContent>
            </Card>
          )}

          {/* --------------------------------------------------------------- */}
          {/* Child cards                                                      */}
          {/* --------------------------------------------------------------- */}
          {childCount > 0 && (
            <Stack spacing={2}>
              {childrenList.map((child, index) => {
                const isSelected = selectedChildId === child.id;
                return (
                  <Card
                    key={child.id}
                    sx={{
                      borderRadius: 2,
                      border: isSelected
                        ? "2px solid #67b587"
                        : "1px solid #e2e8f0",
                      cursor: "pointer",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      "&:hover": {
                        borderColor: "#67b587",
                        boxShadow: "0 2px 12px rgba(103, 181, 135, 0.15)",
                      },
                    }}
                    onClick={() => onSelectedChildChange(child.id)}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 2, md: 2.5 },
                        "&:last-child": { pb: { xs: 2, md: 2.5 } },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <ChildAvatar name={child.name} index={index} />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              color="#2d3748"
                              noWrap
                            >
                              {child.name}
                            </Typography>
                            {isSelected && (
                              <Box
                                sx={{
                                  bgcolor: "#e8f5e9",
                                  color: "#2e7d32",
                                  px: 1,
                                  py: 0.125,
                                  borderRadius: 1,
                                  fontSize: "0.6875rem",
                                  fontWeight: 600,
                                  lineHeight: 1.6,
                                }}
                              >
                                Active
                              </Box>
                            )}
                          </Stack>

                          <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                            {child.age !== null && (
                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                              >
                                <CakeIcon
                                  sx={{ fontSize: 14, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {child.age} years old
                                </Typography>
                              </Stack>
                            )}
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <CalendarTodayIcon
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Born{" "}
                                {new Date(
                                  child.date_of_birth,
                                ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>

                        {/* Actions */}
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(child);
                            }}
                            sx={{
                              color: "text.secondary",
                              "&:hover": { color: "#5b9bd5" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(child);
                            }}
                            sx={{
                              color: "text.secondary",
                              "&:hover": { color: "#e57373" },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Add another child — dashed inline CTA */}
              {!atLimit && (
                <Card
                  sx={{
                    borderRadius: 2,
                    border: "1px dashed #c4cdd5",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                    "&:hover": { borderColor: "#67b587" },
                  }}
                  onClick={openAddDialog}
                >
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <AddIcon sx={{ color: "#67b587", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.secondary"
                      >
                        Add another child
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}
        </Box>
      </Container>

      {/* ================================================================ */}
      {/* Add / Edit dialog                                                */}
      {/* ================================================================ */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography
            component="span"
            variant="h6"
            fontWeight={700}
            color="#2d3748"
          >
            {isEditingChild ? "Edit child" : "Add a child"}
          </Typography>
          {!isEditingChild && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Enter your child's name and date of birth to get started.
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Child's name"
              placeholder="e.g. Emma"
              value={childNameInput}
              onChange={(e) => onChildNameChange(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="Date of birth"
              type="date"
              value={childDateOfBirthInput}
              onChange={(e) => onChildDateOfBirthChange(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!childNameInput || !childDateOfBirthInput}
            sx={{
              bgcolor: "#67b587",
              "&:hover": { bgcolor: "#5a9a74" },
            }}
          >
            {isEditingChild ? "Save changes" : "Add child"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================================================================ */}
      {/* Delete confirmation dialog                                       */}
      {/* ================================================================ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography
            component="span"
            variant="h6"
            fontWeight={700}
            color="#2d3748"
          >
            Remove child profile?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete <strong>{childToDelete?.name}</strong>
            's profile and all their activities, reflections, and reports. This
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
