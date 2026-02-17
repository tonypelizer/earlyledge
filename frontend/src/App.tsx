import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api, setAuthToken } from "./api";
import type {
  Activity,
  Child,
  Skill,
  Suggestion,
  WeeklyDashboard,
} from "./types";

type AuthMode = "login" | "signup";

function App() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [children, setChildren] = useState<Child[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | "">("");

  const [newChildName, setNewChildName] = useState("");
  const [newChildAge, setNewChildAge] = useState<number | "">("");

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | "">("");
  const [activityDate, setActivityDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);

  const [dashboard, setDashboard] = useState<WeeklyDashboard | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("token", token);
      void bootstrap();
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId),
    [children, selectedChildId],
  );

  const bootstrap = async () => {
    try {
      const [childrenRes, skillsRes] = await Promise.all([
        api.get("/children/"),
        api.get("/skills/"),
      ]);
      setChildren(childrenRes.data);
      setSkills(skillsRes.data);
      if (childrenRes.data.length > 0) {
        const id = childrenRes.data[0].id;
        setSelectedChildId(id);
        await refreshChildData(id);
      }
    } catch {
      setError("Unable to load your data. Please log in again.");
      setToken(null);
    }
  };

  const refreshChildData = async (childId: number) => {
    const [dashboardRes, activityRes] = await Promise.all([
      api.get(`/dashboard/weekly/?child_id=${childId}`),
      api.get(`/activities/?child_id=${childId}`),
    ]);
    setDashboard(dashboardRes.data);
    setActivities(activityRes.data);
    setSuggestions([]);
  };

  const onAuth = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await api.post("/auth/signup/", { email, password });
      }
      const response = await api.post("/auth/login/", { email, password });
      setToken(response.data.access);
    } catch {
      setError("Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const addChild = async () => {
    if (!newChildName || !newChildAge) return;
    setError("");
    try {
      const response = await api.post("/children/", {
        name: newChildName,
        age: Number(newChildAge),
      });
      const updated = [...children, response.data as Child];
      setChildren(updated);
      setNewChildName("");
      setNewChildAge("");
      if (!selectedChildId) {
        setSelectedChildId(response.data.id);
        await refreshChildData(response.data.id);
      }
    } catch {
      setError("Could not add child.");
    }
  };

  const addActivity = async () => {
    if (!selectedChildId || !title) return;
    setError("");
    try {
      await api.post("/activities/", {
        child: selectedChildId,
        title,
        notes,
        duration_minutes: durationMinutes ? Number(durationMinutes) : null,
        activity_date: activityDate,
        skill_ids: selectedSkillIds,
      });
      setTitle("");
      setNotes("");
      setDurationMinutes("");
      setSelectedSkillIds([]);
      await refreshChildData(Number(selectedChildId));
    } catch {
      setError("Could not save activity.");
    }
  };

  const getSuggestions = async (skillName: string) => {
    if (!selectedChildId) return;
    const skill = skills.find((entry) => entry.name === skillName);
    if (!skill) return;
    try {
      const response = await api.get(
        `/suggestions/?skill_id=${skill.id}&child_id=${selectedChildId}`,
      );
      setSuggestions(response.data);
    } catch {
      setError("Could not load suggestions.");
    }
  };

  const downloadSnapshot = async () => {
    if (!selectedChildId) return;
    try {
      const response = await api.get(
        `/reports/monthly/?child_id=${selectedChildId}&month=${month}`,
        {
          responseType: "blob",
        },
      );
      const url = URL.createObjectURL(response.data);
      window.open(url, "_blank");
    } catch {
      setError("Could not generate monthly snapshot.");
    }
  };

  if (!token) {
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
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="contained" onClick={onAuth} disabled={loading}>
                {loading ? (
                  <CircularProgress size={20} />
                ) : mode === "login" ? (
                  "Log in"
                ) : (
                  "Create account"
                )}
              </Button>
              <Button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">EarlyLedge</Typography>
          <Button variant="outlined" onClick={() => setToken(null)}>
            Log out
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Children</Typography>
                  <TextField
                    select
                    label="Selected child"
                    value={selectedChildId}
                    onChange={async (e) => {
                      const childId = Number(e.target.value);
                      setSelectedChildId(childId);
                      await refreshChildData(childId);
                    }}
                  >
                    {children.map((child) => (
                      <MenuItem key={child.id} value={child.id}>
                        {child.name} ({child.age})
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Child name"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                  />
                  <TextField
                    label="Age"
                    type="number"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(Number(e.target.value))}
                  />
                  <Button variant="contained" onClick={addChild}>
                    Add child
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Log activity</Typography>
                  <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <TextField
                    label="Notes"
                    multiline
                    minRows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Duration (minutes)"
                      type="number"
                      value={durationMinutes}
                      onChange={(e) =>
                        setDurationMinutes(Number(e.target.value))
                      }
                    />
                    <TextField
                      label="Date"
                      type="date"
                      value={activityDate}
                      onChange={(e) => setActivityDate(e.target.value)}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Stack>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Manual skill override (optional)
                    </Typography>
                    <Grid container spacing={1}>
                      {skills.map((skill) => (
                        <Grid key={skill.id} size={{ xs: 12, sm: 6, md: 4 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedSkillIds.includes(skill.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSkillIds([
                                      ...selectedSkillIds,
                                      skill.id,
                                    ]);
                                  } else {
                                    setSelectedSkillIds(
                                      selectedSkillIds.filter(
                                        (id) => id !== skill.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                            }
                            label={skill.name}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Button variant="contained" onClick={addActivity}>
                    Save activity
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {selectedChild && dashboard && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">
                      Weekly dashboard for {selectedChild.name}
                    </Typography>
                    <Typography color="text.secondary">
                      Activities this week: {dashboard.activity_count}
                    </Typography>
                    <Box sx={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer>
                        <BarChart data={dashboard.skill_counts}>
                          <XAxis
                            dataKey="skill"
                            angle={-20}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar
                            dataKey="count"
                            fill="#5b7f67"
                            radius={[6, 6, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Recent activities
                  </Typography>
                  <List dense>
                    {dashboard.recent_activities.slice(0, 6).map((activity) => (
                      <ListItem key={activity.id} disablePadding>
                        <ListItemText
                          primary={activity.title}
                          secondary={`${activity.activity_date} • ${activity.skills.join(", ") || "Unmapped"}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {dashboard && dashboard.missing_skills.length > 0 && (
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">Gentle nudges</Typography>
                {dashboard.missing_skills.map((skillName) => (
                  <Alert
                    key={skillName}
                    severity="info"
                    action={
                      <Button onClick={() => getSuggestions(skillName)}>
                        See ideas
                      </Button>
                    }
                  >
                    It&apos;s been a while since {skillName} showed up. Would
                    you like a simple idea?
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {suggestions.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Suggestions
              </Typography>
              <List>
                {suggestions.map((suggestion) => (
                  <ListItem key={suggestion.id}>
                    <ListItemText
                      primary={`${suggestion.title} (${suggestion.skill_name})`}
                      secondary={suggestion.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "center" }}
            >
              <Typography variant="h6">Monthly snapshot</Typography>
              <TextField
                label="Month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Button
                variant="contained"
                onClick={downloadSnapshot}
                disabled={!selectedChildId}
              >
                Generate Monthly Snapshot
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              All logged activities
            </Typography>
            <List>
              {activities.slice(0, 12).map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemText
                    primary={activity.title}
                    secondary={`${activity.activity_date} • ${activity.skills.map((s) => s.name).join(", ") || "Unmapped"}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default App;
