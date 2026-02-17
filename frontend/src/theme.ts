import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#5b9bd5", contrastText: "#ffffff" },
    secondary: { main: "#67b587" },
    background: { default: "#faf5f2", paper: "#ffffff" },
    text: {
      primary: "#2d3748",
      secondary: "#718096",
    },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h4: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "#2d3748",
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 700,
      color: "#2d3748",
    },
    body1: {
      fontSize: "0.9375rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});
