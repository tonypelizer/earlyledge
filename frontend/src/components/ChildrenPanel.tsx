import {
  Alert,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { Child } from "../types";

type ChildrenPanelProps = {
  childrenList: Child[];
  selectedChildId: number | "";
  childNameInput: string;
  childDateOfBirthInput: string;
  isEditing: boolean;
  onSelectedChildChange: (childId: number) => void;
  onChildNameChange: (value: string) => void;
  onChildDateOfBirthChange: (value: string) => void;
  onAddChild: () => void;
  onStartEditChild: () => void;
  onUpdateChild: () => void;
  onCancelEdit: () => void;
  onDeleteChild: () => void;
};

export function ChildrenPanel({
  childrenList,
  selectedChildId,
  childNameInput,
  childDateOfBirthInput,
  isEditing,
  onSelectedChildChange,
  onChildNameChange,
  onChildDateOfBirthChange,
  onAddChild,
  onStartEditChild,
  onUpdateChild,
  onCancelEdit,
  onDeleteChild,
}: ChildrenPanelProps) {
  const hasSelectedChild = selectedChildId !== "";

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Children</Typography>
          <TextField
            select
            label="Selected child"
            value={selectedChildId}
            onChange={(event) =>
              onSelectedChildChange(Number(event.target.value))
            }
          >
            {childrenList.map((child) => (
              <MenuItem key={child.id} value={child.id}>
                {child.name} ({child.age ?? "Unknown"})
              </MenuItem>
            ))}
          </TextField>

          {hasSelectedChild && !isEditing && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button variant="outlined" onClick={onStartEditChild}>
                Edit child
              </Button>
              <Button variant="outlined" color="error" onClick={onDeleteChild}>
                Remove child
              </Button>
            </Stack>
          )}

          {isEditing && (
            <Alert severity="info">Editing selected child details.</Alert>
          )}

          <TextField
            label="Name"
            value={childNameInput}
            onChange={(event) => onChildNameChange(event.target.value)}
          />
          <TextField
            label="Date of Birth"
            type="date"
            value={childDateOfBirthInput}
            onChange={(event) => onChildDateOfBirthChange(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {isEditing ? (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button variant="contained" onClick={onUpdateChild}>
                Save changes
              </Button>
              <Button variant="text" onClick={onCancelEdit}>
                Cancel
              </Button>
            </Stack>
          ) : (
            <Button variant="contained" onClick={onAddChild}>
              Add child
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
