import { Button, Stack, Typography } from "@mui/material";

import logoUrl from "../assets/logo.png";

type AppTopBarProps = {
  onLogout: () => void;
};

export function AppTopBar({ onLogout }: AppTopBarProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={1.5} alignItems="center">
        <img
          src={logoUrl}
          alt="EarlyLedge"
          style={{ height: 32, width: "auto", display: "block" }}
        />
        <Typography variant="h4" component="h1">
          EarlyLedge
        </Typography>
      </Stack>
      <Button variant="outlined" onClick={onLogout}>
        Log out
      </Button>
    </Stack>
  );
}
