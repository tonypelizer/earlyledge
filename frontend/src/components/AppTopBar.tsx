import React from "react";
import {
  Avatar,
  IconButton,
  Link,
  Stack,
  Typography,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import logoUrl from "../assets/logo.png";

type AppTopBarProps = {
  userLabel: string;
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onLogout: () => void;
};

export function AppTopBar({
  userLabel,
  currentPage = "home",
  onNavigate,
  onLogout,
}: AppTopBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout();
  };

  const handleNavClick = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleClose();
    onNavigate?.(page);
  };

  return (
    <Stack
      sx={{
        bgcolor: "#fcf9f7",
        borderRadius: 0,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 2,
            px: 3,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <img
              src={logoUrl}
              alt="EarlyLedge"
              style={{ height: 28, width: "auto", display: "block" }}
            />
            <Typography variant="h6" fontWeight={700} fontSize="1.125rem">
              <span style={{ color: "#5d8d92" }}>Early</span>
              <span style={{ color: "#cd975c" }}>Ledge</span>
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            sx={{ flex: 1, justifyContent: "center" }}
          >
            <Link
              href="#"
              onClick={handleNavClick("home")}
              underline={currentPage === "home" ? "always" : "none"}
              color={currentPage === "home" ? "primary" : "text.secondary"}
              fontWeight={currentPage === "home" ? 600 : 500}
              fontSize="0.9375rem"
              sx={
                currentPage === "home"
                  ? {
                      textDecorationThickness: "2.5px",
                      textUnderlineOffset: "6px",
                    }
                  : undefined
              }
            >
              Home
            </Link>
            <Link
              href="#"
              onClick={handleNavClick("suggestions")}
              underline={currentPage === "suggestions" ? "always" : "none"}
              color={
                currentPage === "suggestions" ? "primary" : "text.secondary"
              }
              fontWeight={currentPage === "suggestions" ? 600 : 500}
              fontSize="0.9375rem"
              sx={
                currentPage === "suggestions"
                  ? {
                      textDecorationThickness: "2.5px",
                      textUnderlineOffset: "6px",
                    }
                  : undefined
              }
            >
              Suggestions
            </Link>
            <Link
              href="#"
              onClick={handleNavClick("reports")}
              underline={currentPage === "reports" ? "always" : "none"}
              color={currentPage === "reports" ? "primary" : "text.secondary"}
              fontWeight={currentPage === "reports" ? 600 : 500}
              fontSize="0.9375rem"
              sx={
                currentPage === "reports"
                  ? {
                      textDecorationThickness: "2.5px",
                      textUnderlineOffset: "6px",
                    }
                  : undefined
              }
            >
              Reports
            </Link>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <NotificationsNoneIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ ml: 1, cursor: "pointer" }}
              onClick={handleClick}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#e2e8f0" }}>
                <Typography
                  fontSize="0.875rem"
                  fontWeight={600}
                  color="text.primary"
                >
                  {userLabel.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {userLabel}
              </Typography>
              <KeyboardArrowDownIcon
                fontSize="small"
                sx={{ color: "text.secondary" }}
              />
            </Stack>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleNavClick("children")}>Children</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}
