import {
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
  newChildName: string;
  newChildAge: number | "";
  onSelectedChildChange: (childId: number) => void;
  onNewChildNameChange: (value: string) => void;
  onNewChildAgeChange: (value: number | "") => void;
  onAddChild: () => void;
};

export function ChildrenPanel({
  childrenList,
  selectedChildId,
  newChildName,
  newChildAge,
  onSelectedChildChange,
  onNewChildNameChange,
  onNewChildAgeChange,
  onAddChild,
}: ChildrenPanelProps) {
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
                {child.name} ({child.age})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Child name"
            value={newChildName}
            onChange={(event) => onNewChildNameChange(event.target.value)}
          />
          <TextField
            label="Age"
            type="number"
            value={newChildAge}
            onChange={(event) => {
              const value = event.target.value;
              onNewChildAgeChange(value === "" ? "" : Number(value));
            }}
          />
          <Button variant="contained" onClick={onAddChild}>
            Add child
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
