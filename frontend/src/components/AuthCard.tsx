import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import logoUrl from "../assets/logo.png";

type AuthMode = "login" | "signup";

type AuthCardProps = {
  mode: AuthMode;
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
};

export function AuthCard({
  mode,
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleMode,
}: AuthCardProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent>
          <Stack
            spacing={2}
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              if (loading) {
                return;
              }
              onSubmit();
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <img
                src={logoUrl}
                alt="EarlyLedge"
                style={{ height: 44, width: "auto", display: "block" }}
              />
              <Typography variant="h4" component="h1">
                EarlyLedge
              </Typography>
            </Stack>
            <Typography color="text.secondary">
              A calm way to make everyday learning visible.
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? (
                <CircularProgress size={20} />
              ) : mode === "login" ? (
                "Log in"
              ) : (
                "Create account"
              )}
            </Button>
            <Button type="button" onClick={onToggleMode}>
              {mode === "login"
                ? "Need an account? Sign up"
                : "Already have an account? Log in"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
