import { Button, Stack, Typography } from "@mui/material";

type AppTopBarProps = {
  onLogout: () => void;
};

export function AppTopBar({ onLogout }: AppTopBarProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h4">EarlyLedge</Typography>
      <Button variant="outlined" onClick={onLogout}>
        Log out
      </Button>
    </Stack>
  );
}
