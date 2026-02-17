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
          <Stack spacing={2}>
            <Typography variant="h4">EarlyLedge</Typography>
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
            <Button variant="contained" onClick={onSubmit} disabled={loading}>
              {loading ? (
                <CircularProgress size={20} />
              ) : mode === "login" ? (
                "Log in"
              ) : (
                "Create account"
              )}
            </Button>
            <Button onClick={onToggleMode}>
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
