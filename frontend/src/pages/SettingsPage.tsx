import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import TuneIcon from "@mui/icons-material/Tune";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { api } from "../api";
import { useSnackbar } from "../context/SnackbarContext";
import { UpgradeBanner } from "../components/UpgradeBanner";
import type { Child, PlanInfo } from "../types";

type SettingsPageProps = {
  email: string;
  plan: PlanInfo;
  children: Child[];
  isPlus: boolean;
  maxChildren: number;
  onLogout: () => void;
  onNavigateToPricing: () => void;
  onNavigateToChildren: () => void;
};

// ---------------------------------------------------------------------------
// Section wrapper — consistent card styling
// ---------------------------------------------------------------------------
function SettingsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
          {icon}
          <Typography variant="h6" fontWeight={700} color="#2d3748">
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Simple row helper
// ---------------------------------------------------------------------------
function SettingRow({
  label,
  value,
  action,
  muted = false,
}: {
  label: string;
  value?: React.ReactNode;
  action?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      sx={{ py: 1.5 }}
    >
      <Stack spacing={0.25}>
        <Typography
          variant="body2"
          fontWeight={600}
          color={muted ? "text.secondary" : "#2d3748"}
        >
          {label}
        </Typography>
        {value && (
          <Typography variant="body2" color="text.secondary">
            {value}
          </Typography>
        )}
      </Stack>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  );
}

// ===========================================================================
// Main settings page
// ===========================================================================
export function SettingsPage({
  email,
  plan,
  children,
  isPlus,
  maxChildren,
  onLogout,
  onNavigateToPricing,
  onNavigateToChildren,
}: SettingsPageProps) {
  const { notify } = useSnackbar();
  const childCount = children.length;

  // Password change dialog
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // Delete account dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Insight preferences (local state — persisted to localStorage)
  const [weekStart, setWeekStart] = useState<string>(
    () => localStorage.getItem("el_weekStart") ?? "monday",
  );

  // Skill category toggles
  const defaultSkillToggles: Record<string, boolean> = {
    Literacy: true,
    Numeracy: true,
    Creativity: true,
    Physical: true,
    "Practical Life": true,
    "Social/Emotional": true,
    "Critical Thinking": true,
  };

  const [skillToggles, setSkillToggles] = useState<Record<string, boolean>>(
    () => {
      try {
        const saved = localStorage.getItem("el_skillToggles");
        return saved ? JSON.parse(saved) : defaultSkillToggles;
      } catch {
        return defaultSkillToggles;
      }
    },
  );

  const handleSkillToggle = (skill: string) => {
    setSkillToggles((prev) => {
      const next = { ...prev, [skill]: !prev[skill] };
      localStorage.setItem("el_skillToggles", JSON.stringify(next));
      return next;
    });
  };

  const handleWeekStartChange = (value: string) => {
    setWeekStart(value);
    localStorage.setItem("el_weekStart", value);
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) return;
    if (newPw !== confirmPw) {
      notify("New passwords do not match.", "error");
      return;
    }
    if (newPw.length < 8) {
      notify("Password must be at least 8 characters.", "error");
      return;
    }
    try {
      await api.post("/auth/change-password/", {
        current_password: currentPw,
        new_password: newPw,
      });
      notify("Password updated.", "success");
      setPwOpen(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch {
      notify("Could not change password. Check your current password.", "error");
    }
  };

  const handleExportData = async () => {
    if (!isPlus) {
      notify("Data export is a Plus feature.", "info");
      return;
    }
    try {
      const response = await api.get("/me/export/", { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `earlyledge-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      notify("Data exported successfully.", "success");
    } catch {
      notify("Export is not available yet. Coming soon!", "info");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    try {
      await api.delete("/me/account/");
      notify("Your account has been deleted.", "success");
      onLogout();
    } catch {
      notify("Account deletion is not available yet. Contact support.", "info");
    }
  };

  return (
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh", pb: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ pt: { xs: 3, md: 4 }, px: { xs: 1, md: 2 } }}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#2d3748"
            sx={{ mb: 4 }}
          >
            Settings
          </Typography>

          <Stack spacing={3}>
            {/* ---------------------------------------------------------- */}
            {/* 1. Account                                                  */}
            {/* ---------------------------------------------------------- */}
            <SettingsSection
              icon={<EmailIcon sx={{ color: "#5b9bd5", fontSize: 24 }} />}
              title="Account"
            >
              <Stack divider={<Divider />}>
                <SettingRow label="Email" value={email} />

                <SettingRow
                  label="Password"
                  value="••••••••"
                  action={
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setPwOpen(true)}
                      startIcon={<LockIcon />}
                      sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                      Change
                    </Button>
                  }
                />

                <SettingRow
                  label="Sign out"
                  value="End your current session"
                  action={
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={onLogout}
                      startIcon={<LogoutIcon />}
                      sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                      Sign out
                    </Button>
                  }
                />
              </Stack>
            </SettingsSection>

            {/* ---------------------------------------------------------- */}
            {/* 2. Plan & Billing                                           */}
            {/* ---------------------------------------------------------- */}
            <SettingsSection
              icon={<AutoAwesomeIcon sx={{ color: "#cd975c", fontSize: 24 }} />}
              title="Plan & Billing"
            >
              <Stack spacing={2.5}>
                {/* Current plan badge */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography variant="body1" fontWeight={600} color="#2d3748">
                    Current plan:
                  </Typography>
                  <Chip
                    label={isPlus ? "Plus" : "Free"}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: isPlus ? "#fff3e0" : "#e8f5e9",
                      color: isPlus ? "#cd975c" : "#2e7d32",
                    }}
                  />
                </Stack>

                {isPlus ? (
                  // Plus user view
                  <Stack divider={<Divider />}>
                    <SettingRow
                      label="Renewal"
                      value={
                        plan.ends_at
                          ? `Renews on ${new Date(plan.ends_at).toLocaleDateString()}`
                          : "No renewal date set"
                      }
                    />
                    <SettingRow
                      label="Manage subscription"
                      value="Update payment method or billing details"
                      action={
                        <Button
                          size="small"
                          variant="outlined"
                          disabled
                          sx={{ textTransform: "none", fontWeight: 500 }}
                        >
                          Coming soon
                        </Button>
                      }
                    />
                    <SettingRow
                      label="Downgrade to Free"
                      value="You'll keep your data but visibility will be limited to 90 days"
                      action={
                        <Button
                          size="small"
                          variant="outlined"
                          color="inherit"
                          disabled
                          sx={{ textTransform: "none", fontWeight: 500 }}
                        >
                          Downgrade
                        </Button>
                      }
                    />
                  </Stack>
                ) : (
                  // Free user view
                  <>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleOutlineIcon
                          sx={{ fontSize: 18, color: "#67b587" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          90-day visibility window
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleOutlineIcon
                          sx={{ fontSize: 18, color: "#67b587" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          1 child profile
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleOutlineIcon
                          sx={{ fontSize: 18, color: "#67b587" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Basic suggestions
                        </Typography>
                      </Stack>
                    </Stack>

                    <Box sx={{ mt: 1 }}>
                      <UpgradeBanner
                        message="Unlock your child's full learning story with Plus."
                        description="See long-term patterns, personalized suggestions, and printable summaries."
                        onUpgrade={onNavigateToPricing}
                        ctaLabel="See Plus plans"
                        compact
                      />
                    </Box>
                  </>
                )}
              </Stack>
            </SettingsSection>

            {/* ---------------------------------------------------------- */}
            {/* 3. Child Profiles                                           */}
            {/* ---------------------------------------------------------- */}
            <SettingsSection
              icon={<ChildCareIcon sx={{ color: "#67b587", fontSize: 24 }} />}
              title="Child Profiles"
            >
              <Stack spacing={2}>
                {/* Usage indicator */}
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" fontWeight={600} color="#2d3748">
                      {childCount} of {maxChildren} profiles used
                    </Typography>
                    <Chip
                      label={isPlus ? "Plus" : "Free"}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500, fontSize: "0.75rem" }}
                    />
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(childCount / maxChildren) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "#e8f0e8",
                      "& .MuiLinearProgress-bar": {
                        bgcolor:
                          childCount >= maxChildren ? "#e57373" : "#67b587",
                        borderRadius: 3,
                      },
                    }}
                  />
                </Stack>

                {/* Child list */}
                {children.length > 0 ? (
                  <Stack divider={<Divider />}>
                    {children.map((child) => (
                      <Stack
                        key={child.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ py: 1.25 }}
                      >
                        <Stack>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="#2d3748"
                          >
                            {child.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {child.age !== null
                              ? `${child.age} years old`
                              : "Age not set"}{" "}
                            · Added{" "}
                            {new Date(child.created_at).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No children added yet.
                  </Typography>
                )}

                {/* Actions */}
                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={onNavigateToChildren}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    Manage children
                  </Button>
                </Stack>

                {/* Upgrade CTA for Free users at limit */}
                {childCount >= maxChildren && !isPlus && (
                  <UpgradeBanner
                    message={`Your Free plan supports ${maxChildren} child profile.`}
                    description="Upgrade to Plus to add up to 5 child profiles."
                    onUpgrade={onNavigateToPricing}
                    ctaLabel="See Plus plan"
                    compact
                  />
                )}
              </Stack>
            </SettingsSection>

            {/* ---------------------------------------------------------- */}
            {/* 4. Insight Preferences                                      */}
            {/* ---------------------------------------------------------- */}
            <SettingsSection
              icon={<TuneIcon sx={{ color: "#8c7ad9", fontSize: 24 }} />}
              title="Insight Preferences"
            >
              <Stack spacing={2.5}>
                {/* Week start day */}
                <FormControl size="small" sx={{ maxWidth: 260 }}>
                  <InputLabel>Week starts on</InputLabel>
                  <Select
                    value={weekStart}
                    label="Week starts on"
                    onChange={(e) => handleWeekStartChange(e.target.value)}
                  >
                    <MenuItem value="monday">Monday</MenuItem>
                    <MenuItem value="sunday">Sunday</MenuItem>
                    <MenuItem value="saturday">Saturday</MenuItem>
                  </Select>
                </FormControl>

                {/* Skill category toggles */}
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="#2d3748"
                    sx={{ mb: 1.5 }}
                  >
                    Skill categories shown in dashboard
                  </Typography>
                  <Stack spacing={0.5}>
                    {Object.entries(skillToggles).map(([skill, enabled]) => (
                      <Stack
                        key={skill}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ py: 0.5 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {skill}
                        </Typography>
                        <Switch
                          size="small"
                          checked={enabled}
                          onChange={() => handleSkillToggle(skill)}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {!isPlus && (
                  <Typography variant="caption" color="text.secondary">
                    Plus users get personalized insight preferences based on
                    their child's unique patterns.
                  </Typography>
                )}
              </Stack>
            </SettingsSection>

            {/* ---------------------------------------------------------- */}
            {/* 5. Privacy & Data                                           */}
            {/* ---------------------------------------------------------- */}
            <SettingsSection
              icon={<ShieldIcon sx={{ color: "#5b9bd5", fontSize: 24 }} />}
              title="Privacy & Data"
            >
              <Stack spacing={2}>
                <Box
                  sx={{
                    bgcolor: "#f0f7f4",
                    borderRadius: 1.5,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="#2d3748"
                    sx={{ mb: 0.5 }}
                  >
                    Your data belongs to you.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We do not sell, share, or monetize your family's data.
                    EarlyLedge exists to help you — not advertisers.
                  </Typography>
                </Box>

                <Divider />

                <SettingRow
                  label="Export your data"
                  value={
                    isPlus
                      ? "Download all your activities, reflections, and reports as JSON"
                      : "Available on the Plus plan"
                  }
                  action={
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleExportData}
                      disabled={!isPlus}
                      startIcon={<FileDownloadIcon />}
                      sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                      {isPlus ? "Export" : "Plus only"}
                    </Button>
                  }
                />

                <SettingRow
                  label="Download activity history"
                  value="Get a simple list of all logged activities"
                  action={
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={async () => {
                        try {
                          const resp = await api.get("/activities/", {
                            params: { format: "csv" },
                          });
                          const blob = new Blob(
                            [JSON.stringify(resp.data, null, 2)],
                            { type: "application/json" },
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `earlyledge-activities-${new Date().toISOString().slice(0, 10)}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          notify("Activity history downloaded.", "success");
                        } catch {
                          notify("Could not download activity history.", "error");
                        }
                      }}
                      startIcon={<FileDownloadIcon />}
                      sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                      Download
                    </Button>
                  }
                />

                <Divider />

                <SettingRow
                  label="Delete account"
                  value="Permanently delete your account and all associated data"
                  muted
                  action={
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => setDeleteOpen(true)}
                      startIcon={<DeleteOutlineIcon />}
                      sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                      Delete account
                    </Button>
                  }
                />
              </Stack>
            </SettingsSection>
          </Stack>
        </Box>
      </Container>

      {/* ================================================================ */}
      {/* Change password dialog                                           */}
      {/* ================================================================ */}
      <Dialog
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography component="span" variant="h6" fontWeight={700} color="#2d3748">
            Change password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              type="password"
              label="Current password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              type="password"
              label="New password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              type="password"
              label="Confirm new password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setPwOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={!currentPw || !newPw || !confirmPw}
          >
            Update password
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================================================================ */}
      {/* Delete account dialog                                            */}
      {/* ================================================================ */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          <Typography component="span" variant="h6" fontWeight={700} color="error.main">
            Delete your account?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              This will permanently delete your account, all child profiles,
              activities, reflections, and reports. This action cannot be undone.
            </Typography>
            <TextField
              label='Type "DELETE" to confirm'
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={deleteConfirmText !== "DELETE"}
          >
            Delete my account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
