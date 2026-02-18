import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { api, setAuthToken } from "./api";
import { ActivitiesListCard } from "./components/ActivitiesListCard";
import { ActivityModal } from "./components/ActivityModal";
import { AppTopBar } from "./components/AppTopBar";
import { AuthCard } from "./components/AuthCard";
import { GentleNudgesCard } from "./components/GentleNudgesCard";
import { SuggestionsCard } from "./components/SuggestionsCard";
import { WeeklyDashboardSection } from "./components/WeeklyDashboardSection";
import { SuggestionsPage } from "./pages/SuggestionsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ChildrenPage } from "./pages/ChildrenPage";
import type {
  Activity,
  Child,
  Skill,
  Suggestion,
  WeeklyDashboard,
} from "./types";

type AuthMode = "login" | "signup";
type PageType = "home" | "suggestions" | "reports" | "children";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [children, setChildren] = useState<Child[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | "">("");

  const [childNameInput, setChildNameInput] = useState("");
  const [childDateOfBirthInput, setChildDateOfBirthInput] = useState("");
  const [editingChildId, setEditingChildId] = useState<number | null>(null);

  const [editingActivityId, setEditingActivityId] = useState<number | null>(
    null,
  );
  const [activityModalOpen, setActivityModalOpen] = useState(false);
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedChild = useMemo(
    () => children.find((child) => child.id === selectedChildId),
    [children, selectedChildId],
  );

  const isEditingChild = editingChildId !== null;
  const userLabel = email ? email.split("@")[0] : "Parent";

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
    if (!childNameInput || !childDateOfBirthInput) {
      return;
    }

    setError("");
    try {
      const response = await api.post("/children/", {
        name: childNameInput,
        date_of_birth: childDateOfBirthInput,
      });

      const createdChild = response.data as Child;
      setChildren((previous) => [...previous, createdChild]);
      setChildNameInput("");
      setChildDateOfBirthInput("");

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
    setEditingChildId(null);

    const child = children.find((entry) => entry.id === childId);
    if (child) {
      setChildNameInput(child.name);
      setChildDateOfBirthInput(child.date_of_birth);
    }

    await refreshChildData(childId);
  };

  const startEditChild = () => {
    if (!selectedChild) {
      return;
    }

    setEditingChildId(selectedChild.id);
    setChildNameInput(selectedChild.name);
    setChildDateOfBirthInput(selectedChild.date_of_birth);
  };

  const cancelEditChild = () => {
    setEditingChildId(null);
    setChildNameInput("");
    setChildDateOfBirthInput("");
  };

  const updateChild = async () => {
    if (!editingChildId || !childNameInput || !childDateOfBirthInput) {
      return;
    }

    setError("");
    try {
      const response = await api.patch(`/children/${editingChildId}/`, {
        name: childNameInput,
        date_of_birth: childDateOfBirthInput,
      });
      const updatedChild = response.data as Child;

      setChildren((previous) =>
        previous.map((child) =>
          child.id === updatedChild.id ? updatedChild : child,
        ),
      );
      setEditingChildId(null);
      setChildNameInput("");
      setChildDateOfBirthInput("");
    } catch {
      setError("Could not update child details.");
    }
  };

  const deleteChild = async () => {
    if (!selectedChildId) {
      return;
    }

    setError("");
    try {
      const targetId = Number(selectedChildId);
      await api.delete(`/children/${targetId}/`);

      const nextChildren = children.filter((child) => child.id !== targetId);
      setChildren(nextChildren);
      setEditingChildId(null);
      setChildNameInput("");
      setChildDateOfBirthInput("");

      if (nextChildren.length > 0) {
        const nextSelectedId = nextChildren[0].id;
        setSelectedChildId(nextSelectedId);
        await refreshChildData(nextSelectedId);
      } else {
        setSelectedChildId("");
        setDashboard(null);
        setActivities([]);
        setSuggestions([]);
      }
    } catch {
      setError("Could not remove child.");
    }
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

      setActivityModalOpen(false);
      setTitle("");
      setNotes("");
      setDurationMinutes("");
      setActivityDate(dayjs().format("YYYY-MM-DD"));
      setSelectedSkillIds([]);

      await refreshChildData(Number(selectedChildId));
    } catch {
      setError("Could not save activity.");
    }
  };

  const startEditActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setTitle(activity.title);
    setNotes(activity.notes);
    setDurationMinutes(activity.duration_minutes ?? "");
    setActivityDate(activity.activity_date);
    setSelectedSkillIds(activity.skills.map((s) => s.id));
    setActivityModalOpen(true);
  };

  const openAddActivityModal = () => {
    setEditingActivityId(null);
    setTitle("");
    setNotes("");
    setDurationMinutes("");
    setActivityDate(dayjs().format("YYYY-MM-DD"));
    setSelectedSkillIds([]);
    setActivityModalOpen(true);
  };

  const cancelEditActivity = () => {
    setActivityModalOpen(false);
    setEditingActivityId(null);
    setTitle("");
    setNotes("");
    setDurationMinutes("");
    setActivityDate(dayjs().format("YYYY-MM-DD"));
    setSelectedSkillIds([]);
  };

  const updateActivity = async () => {
    if (!editingActivityId || !title) {
      return;
    }

    setError("");
    try {
      await api.patch(`/activities/${editingActivityId}/`, {
        title,
        notes,
        duration_minutes: durationMinutes ? Number(durationMinutes) : null,
        activity_date: activityDate,
        skill_ids: selectedSkillIds,
      });

      setActivityModalOpen(false);
      setEditingActivityId(null);
      setTitle("");
      setNotes("");
      setDurationMinutes("");
      setActivityDate(dayjs().format("YYYY-MM-DD"));
      setSelectedSkillIds([]);

      if (selectedChildId) {
        await refreshChildData(Number(selectedChildId));
      }
    } catch {
      setError("Could not update activity.");
    }
  };

  const deleteActivity = async (activityId: number) => {
    setError("");
    try {
      await api.delete(`/activities/${activityId}/`);

      if (selectedChildId) {
        await refreshChildData(Number(selectedChildId));
      }
    } catch {
      setError("Could not delete activity.");
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
    <Box sx={{ bgcolor: "#faf5f2", minHeight: "100vh" }}>
      <AppTopBar
        userLabel={userLabel}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page as PageType)}
        onLogout={() => setToken(null)}
      />

      {currentPage === "suggestions" ? (
        <SuggestionsPage selectedChild={selectedChild} />
      ) : currentPage === "reports" ? (
        <ReportsPage selectedChild={selectedChild} />
      ) : currentPage === "children" ? (
        <ChildrenPage
          children={children}
          selectedChildId={selectedChildId}
          childNameInput={childNameInput}
          childDateOfBirthInput={childDateOfBirthInput}
          isEditingChild={isEditingChild}
          error={error}
          onSelectedChildChange={onSelectedChildChange}
          onChildNameChange={setChildNameInput}
          onChildDateOfBirthChange={setChildDateOfBirthInput}
          onAddChild={addChild}
          onStartEditChild={startEditChild}
          onUpdateChild={updateChild}
          onCancelEdit={cancelEditChild}
          onDeleteChild={deleteChild}
        />
      ) : (
        <Container maxWidth="xl">
          <Box sx={{ px: 3, py: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Typography
              variant="h4"
              fontWeight={700}
              color="#2d3748"
              sx={{ mb: 3 }}
            >
              Welcome{selectedChild ? `, ${selectedChild.name}` : ""}!
            </Typography>

            <Grid container spacing={3} alignItems="flex-start">
              <Grid size={{ xs: 12, lg: 8 }}>
                <Stack spacing={3}>
                  {selectedChild && dashboard && (
                    <WeeklyDashboardSection
                      childName={selectedChild.name}
                      dashboard={dashboard}
                    />
                  )}

                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={openAddActivityModal}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        bgcolor: "#67b587",
                        "&:hover": {
                          bgcolor: "#5a9a74",
                        },
                      }}
                    >
                      + Add Activity
                    </Button>
                  </Box>

                  <ActivitiesListCard
                    activities={activities}
                    onEditActivity={startEditActivity}
                    onDeleteActivity={deleteActivity}
                  />

                  <SuggestionsCard suggestions={suggestions} />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <Stack spacing={3}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="#2d3748"
                        sx={{ mb: 1.5 }}
                      >
                        Weekly Reflections
                      </Typography>
                      <Typography
                        color="text.secondary"
                        fontSize="0.875rem"
                        sx={{ mb: 2 }}
                      >
                        What was a highlight of your child&apos;s learning this
                        week?
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ py: 1.25, fontWeight: 600 }}
                      >
                        Write a Note
                      </Button>
                    </CardContent>
                  </Card>

                  <GentleNudgesCard
                    missingSkills={dashboard?.missing_skills ?? []}
                    onSeeIdeas={getSuggestions}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <ActivityModal
            open={activityModalOpen}
            title={title}
            notes={notes}
            durationMinutes={durationMinutes}
            activityDate={activityDate}
            selectedSkillIds={selectedSkillIds}
            skills={skills}
            isEditing={editingActivityId !== null}
            onTitleChange={setTitle}
            onNotesChange={setNotes}
            onDurationChange={setDurationMinutes}
            onActivityDateChange={setActivityDate}
            onSkillToggle={onSkillToggle}
            onSave={editingActivityId !== null ? updateActivity : addActivity}
            onCancel={cancelEditActivity}
          />
        </Container>
      )}
    </Box>
  );
}

export default App;
