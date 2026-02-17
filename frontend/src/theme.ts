import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#5b7f67" },
    secondary: { main: "#a67c52" },
    background: { default: "#f6f8f5", paper: "#ffffff" },
    text: { primary: "#2f3b2f", secondary: "#5f6a5f" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
});
