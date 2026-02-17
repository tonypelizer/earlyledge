import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type MonthlySnapshotCardProps = {
  month: string;
  disabled: boolean;
  onMonthChange: (value: string) => void;
  onGenerate: () => void;
};

export function MonthlySnapshotCard({
  month,
  disabled,
  onMonthChange,
  onGenerate,
}: MonthlySnapshotCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
        >
          <Typography variant="h6">Monthly snapshot</Typography>
          <TextField
            label="Month"
            type="month"
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button variant="contained" onClick={onGenerate} disabled={disabled}>
            Generate Monthly Snapshot
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
