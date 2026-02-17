import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Alert, Container, Grid, Stack } from "@mui/material";

import { api, setAuthToken } from "./api";
import { ActivitiesListCard } from "./components/ActivitiesListCard";
import { ActivityFormCard } from "./components/ActivityFormCard";
import { AppTopBar } from "./components/AppTopBar";
import { AuthCard } from "./components/AuthCard";
import { ChildrenPanel } from "./components/ChildrenPanel";
import { GentleNudgesCard } from "./components/GentleNudgesCard";
import { MonthlySnapshotCard } from "./components/MonthlySnapshotCard";
import { SuggestionsCard } from "./components/SuggestionsCard";
import { WeeklyDashboardSection } from "./components/WeeklyDashboardSection";
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

  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId),
    [children, selectedChildId],
  );

  const refreshChildData = useCallback(async (childId: number) => {
    const [dashboardRes, activityRes] = await Promise.all([
      api.get(`/dashboard/weekly/?child_id=${childId}`),
      api.get(`/activities/?child_id=${childId}`),
    ]);
    setDashboard(dashboardRes.data);
    setActivities(activityRes.data);
    setSuggestions([]);
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const [childrenRes, skillsRes] = await Promise.all([
        api.get("/children/"),
        api.get("/skills/"),
      ]);
      const loadedChildren = childrenRes.data as Child[];
      setChildren(loadedChildren);
      setSkills(skillsRes.data);

      if (loadedChildren.length > 0) {
        const firstChildId = loadedChildren[0].id;
        setSelectedChildId(firstChildId);
        await refreshChildData(firstChildId);
      }
    } catch {
      setError("Unable to load your data. Please log in again.");
      setToken(null);
    }
  }, [refreshChildData]);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("token", token);
      void bootstrap();
    } else {
      localStorage.removeItem("token");
    }
  }, [token, bootstrap]);

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
    if (!newChildName || !newChildAge) {
      return;
    }

    setError("");
    try {
      const response = await api.post("/children/", {
        name: newChildName,
        age: Number(newChildAge),
      });

      const createdChild = response.data as Child;
      setChildren((previous) => [...previous, createdChild]);
      setNewChildName("");
      setNewChildAge("");

      if (!selectedChildId) {
        setSelectedChildId(createdChild.id);
        await refreshChildData(createdChild.id);
      }
    } catch {
      setError("Could not add child.");
    }
  };

  const onSelectedChildChange = async (childId: number) => {
    setSelectedChildId(childId);
    await refreshChildData(childId);
  };

  const onSkillToggle = (skillId: number, isSelected: boolean) => {
    setSelectedSkillIds((previous) => {
      if (isSelected) {
        return [...previous, skillId];
      }
      return previous.filter((id) => id !== skillId);
    });
  };

  const addActivity = async () => {
    if (!selectedChildId || !title) {
      return;
    }

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
    if (!selectedChildId) {
      return;
    }

    const skill = skills.find((entry) => entry.name === skillName);
    if (!skill) {
      return;
    }

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
    if (!selectedChildId) {
      return;
    }

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
      <AuthCard
        mode={mode}
        email={email}
        password={password}
        loading={loading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={onAuth}
        onToggleMode={() =>
          setMode((previous) => (previous === "login" ? "signup" : "login"))
        }
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <AppTopBar onLogout={() => setToken(null)} />

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ChildrenPanel
              childrenList={children}
              selectedChildId={selectedChildId}
              newChildName={newChildName}
              newChildAge={newChildAge}
              onSelectedChildChange={onSelectedChildChange}
              onNewChildNameChange={setNewChildName}
              onNewChildAgeChange={setNewChildAge}
              onAddChild={addChild}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <ActivityFormCard
              title={title}
              notes={notes}
              durationMinutes={durationMinutes}
              activityDate={activityDate}
              selectedSkillIds={selectedSkillIds}
              skills={skills}
              onTitleChange={setTitle}
              onNotesChange={setNotes}
              onDurationChange={setDurationMinutes}
              onActivityDateChange={setActivityDate}
              onSkillToggle={onSkillToggle}
              onSaveActivity={addActivity}
            />
          </Grid>
        </Grid>

        {selectedChild && dashboard && (
          <WeeklyDashboardSection
            childName={selectedChild.name}
            dashboard={dashboard}
          />
        )}

        <GentleNudgesCard
          missingSkills={dashboard?.missing_skills ?? []}
          onSeeIdeas={getSuggestions}
        />

        <SuggestionsCard suggestions={suggestions} />

        <MonthlySnapshotCard
          month={month}
          disabled={!selectedChildId}
          onMonthChange={setMonth}
          onGenerate={downloadSnapshot}
        />

        <ActivitiesListCard activities={activities} />
      </Stack>
    </Container>
  );
}

export default App;
