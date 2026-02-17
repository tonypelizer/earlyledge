import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { Skill } from "../types";

type ActivityFormCardProps = {
  title: string;
  notes: string;
  durationMinutes: number | "";
  activityDate: string;
  selectedSkillIds: number[];
  skills: Skill[];
  onTitleChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onDurationChange: (value: number | "") => void;
  onActivityDateChange: (value: string) => void;
  onSkillToggle: (skillId: number, isSelected: boolean) => void;
  onSaveActivity: () => void;
};

export function ActivityFormCard({
  title,
  notes,
  durationMinutes,
  activityDate,
  selectedSkillIds,
  skills,
  onTitleChange,
  onNotesChange,
  onDurationChange,
  onActivityDateChange,
  onSkillToggle,
  onSaveActivity,
}: ActivityFormCardProps) {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "#67b587",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="white" fontWeight={700} fontSize="1rem">
                +
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} color="#2d3748">
              Add an Activity
            </Typography>
          </Stack>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            required
          />
          <TextField
            label="Notes"
            multiline
            minRows={2}
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
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
            />
            <TextField
              label="Date"
              type="date"
              value={activityDate}
              onChange={(event) => onActivityDateChange(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Manual skill override (optional)
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
          <Button variant="contained" onClick={onSaveActivity}>
            Save activity
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
