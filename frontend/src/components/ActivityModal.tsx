import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { Skill } from "../types";

type ActivityModalProps = {
  open: boolean;
  title: string;
  notes: string;
  durationMinutes: number | "";
  activityDate: string;
  selectedSkillIds: number[];
  skills: Skill[];
  isEditing: boolean;
  onTitleChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onDurationChange: (value: number | "") => void;
  onActivityDateChange: (value: string) => void;
  onSkillToggle: (skillId: number, isSelected: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ActivityModal({
  open,
  title,
  notes,
  durationMinutes,
  activityDate,
  selectedSkillIds,
  skills,
  isEditing,
  onTitleChange,
  onNotesChange,
  onDurationChange,
  onActivityDateChange,
  onSkillToggle,
  onSave,
  onCancel,
}: ActivityModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      disableAutoFocus
      disableRestoreFocus
      disableEnforceFocus
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Typography
          component="span"
          variant="h6"
          fontWeight={700}
          color="#2d3748"
        >
          {isEditing ? "Edit Activity" : "Add Activity"}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Notes"
            multiline
            minRows={2}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            fullWidth
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Duration (minutes)"
              type="number"
              value={durationMinutes}
              onChange={(event) => {
                const value = event.target.value;
                onDurationChange(value === "" ? "" : Number(value));
              }}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={activityDate}
              onChange={(event) => onActivityDateChange(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Stack>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Skills (auto-detected from title/notes, or override manually)
            </Typography>
            <Grid container spacing={1}>
              {skills.map((skill) => (
                <Grid key={skill.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedSkillIds.includes(skill.id)}
                        onChange={(event) =>
                          onSkillToggle(skill.id, event.target.checked)
                        }
                      />
                    }
                    label={skill.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" disabled={!title.trim()}>
          {isEditing ? "Update Activity" : "Save Activity"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
