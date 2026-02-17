import {
  Avatar,
  Box,
  Button,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import logoUrl from "../assets/logo.png";

type AppTopBarProps = {
  userLabel: string;
  onLogout: () => void;
};

export function AppTopBar({ userLabel, onLogout }: AppTopBarProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
      sx={{
        py: 1.5,
        px: 2,
        bgcolor: "background.paper",
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" minWidth={180}>
        <img
          src={logoUrl}
          alt="EarlyLedge"
          style={{ height: 30, width: "auto", display: "block" }}
        />
        <Typography variant="h6" fontWeight={700}>
          EarlyLedge
        </Typography>
      </Stack>

      <Stack direction="row" spacing={3} alignItems="center">
        <Link href="#" underline="always" color="primary" fontWeight={600}>
          Home
        </Link>
        <Link href="#" underline="none" color="text.secondary" fontWeight={600}>
          Suggestions
        </Link>
        <Link href="#" underline="none" color="text.secondary" fontWeight={600}>
          Reports
        </Link>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
      >
        <IconButton size="small" color="default">
          <NotificationsNoneIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="default">
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1 }}>
          <Avatar sx={{ width: 28, height: 28 }}>
            {userLabel.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {userLabel}
          </Typography>
          <KeyboardArrowDownIcon fontSize="small" color="action" />
        </Stack>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Button size="small" variant="outlined" onClick={onLogout}>
            Log out
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}
