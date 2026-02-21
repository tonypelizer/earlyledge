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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HomeIcon from "@mui/icons-material/Home";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
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
    setDrawerOpen(false);
    onNavigate?.(page);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigationItems = [
    { page: "home", label: "Home", icon: <HomeIcon /> },
    { page: "suggestions", label: "Suggestions", icon: <LightbulbIcon /> },
    { page: "reports", label: "Reports", icon: <AssessmentIcon /> },
    { page: "activities", label: "All Activities", icon: <ListAltIcon /> },
    { page: "children", label: "Children", icon: <ChildCareIcon /> },
    { page: "pricing", label: "Pricing", icon: <AutoAwesomeIcon /> },
    { page: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <Stack
      sx={{
        bgcolor: "#fcf9f7",
        borderRadius: 0,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 1,
            px: { xs: 1, md: 2 },
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={handleNavClick("home")}
          >
            <img
              src={logoUrl}
              alt="EarlyLedge"
              style={{ height: 28, width: "auto", display: "block" }}
            />
            {!isMobile && (
              <Typography variant="h6" fontWeight={700} fontSize="1.125rem">
                <span style={{ color: "#5d8d92" }}>Early</span>
                <span style={{ color: "#cd975c" }}>Ledge</span>
              </Typography>
            )}
          </Stack>

          {/* Desktop Navigation */}
          {!isMobile && (
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
              <Link
                href="#"
                onClick={handleNavClick("pricing")}
                underline={currentPage === "pricing" ? "always" : "none"}
                color={currentPage === "pricing" ? "primary" : "text.secondary"}
                fontWeight={currentPage === "pricing" ? 600 : 500}
                fontSize="0.9375rem"
                sx={
                  currentPage === "pricing"
                    ? {
                        textDecorationThickness: "2.5px",
                        textUnderlineOffset: "6px",
                      }
                    : undefined
                }
              >
                Pricing
              </Link>
            </Stack>
          )}

          {/* Right side controls */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {!isMobile && (
              <>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <NotificationsNoneIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: "text.secondary" }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </>
            )}

            {/* Desktop avatar section */}
            {!isMobile && (
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
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.primary"
                >
                  {userLabel}
                </Typography>
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
              </Stack>
            )}

            {/* Mobile avatar */}
            {isMobile && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#e2e8f0",
                  cursor: "pointer",
                }}
                onClick={handleDrawerToggle}
              >
                <Typography
                  fontSize="0.875rem"
                  fontWeight={600}
                  color="text.primary"
                >
                  {userLabel.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
            )}

            {/* Desktop menu */}
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
              <MenuItem onClick={handleNavClick("settings")}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
          },
        }}
      >
        <Stack sx={{ width: 280, height: "100%" }}>
          {/* User info header */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ p: 3, bgcolor: "#fcf9f7" }}
          >
            <Avatar sx={{ width: 40, height: 40, bgcolor: "#e2e8f0" }}>
              <Typography fontSize="1rem" fontWeight={600} color="text.primary">
                {userLabel.charAt(0).toUpperCase()}
              </Typography>
            </Avatar>
            <Stack>
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {userLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back!
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          {/* Navigation items */}
          <List sx={{ flex: 1 }}>
            {navigationItems.map((item) => (
              <ListItem key={item.page} disablePadding>
                <ListItemButton
                  onClick={handleNavClick(item.page)}
                  selected={currentPage === item.page}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "rgba(91, 155, 213, 0.1)",
                      "&:hover": {
                        bgcolor: "rgba(91, 155, 213, 0.15)",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        currentPage === item.page
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontWeight: currentPage === item.page ? 600 : 400,
                        color:
                          currentPage === item.page
                            ? "primary.main"
                            : "text.primary",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          {/* Settings and logout */}
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon sx={{ color: "text.secondary" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </ListItem>
          </List>
        </Stack>
      </Drawer>
    </Stack>
  );
}
