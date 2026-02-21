import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import { api, setAuthToken, setOnUnauthenticated } from "./api";
import { useSnackbar } from "./context/SnackbarContext";
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
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { LandingPage } from "./pages/LandingPage";
import { PricingPage } from "./pages/PricingPage";
import { SettingsPage } from "./pages/SettingsPage";
import { usePlan } from "./hooks/usePlan";
import type {
  Activity,
  Child,
  Skill,
  Suggestion,
  WeeklyDashboard,
} from "./types";

type AuthMode = "login" | "signup";
type PageType =
  | "home"
  | "suggestions"
  | "reports"
  | "children"
  | "activities"
  | "pricing"
  | "settings";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { notify } = useSnackbar();

  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState<string>(
    localStorage.getItem("userEmail") ?? "",
  );
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [showAuth, setShowAuth] = useState(false);

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
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [reflectionNote, setReflectionNote] = useState("");
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

  const { plan, isPlus, maxChildren, refetchPlan } = usePlan();

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
      await refetchPlan();
      if (loadedChildren.length > 0) {
        const firstChildId = loadedChildren[0].id;
        setSelectedChildId(firstChildId);
        await refreshChildData(firstChildId);
      }
    } catch {
      notify("Unable to load your data. Please log in again.", "error");
      setToken(null);
    }
  }, [refreshChildData]);

  useEffect(() => {
    setOnUnauthenticated(() => setToken(null));
  }, []);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem("token", token);
      void bootstrap();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      setEmail("");
      // Clear all user data so it doesn't bleed into the next session
      setChildren([]);
      setSkills([]);
      setSelectedChildId("");
      setDashboard(null);
      setActivities([]);
      setSuggestions([]);
      setShowAuth(false);
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
      localStorage.setItem("userEmail", email);
      localStorage.setItem("refreshToken", response.data.refresh);
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

    try {
      const response = await api.post("/children/", {
        name: childNameInput,
        date_of_birth: childDateOfBirthInput,
      });

      const createdChild = response.data as Child;
      setChildren((previous) => [...previous, createdChild]);
      setChildNameInput("");
      setChildDateOfBirthInput("");
      notify("Child added!", "success");

      if (!selectedChildId) {
        setSelectedChildId(createdChild.id);
        await refreshChildData(createdChild.id);
      }
    } catch {
      notify("Could not add child.", "error");
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
      notify("Changes saved.", "success");
    } catch {
      notify("Could not update child details.", "error");
    }
  };

  const deleteChild = async () => {
    if (!selectedChildId) {
      return;
    }

    try {
      const targetId = Number(selectedChildId);
      await api.delete(`/children/${targetId}/`);

      const nextChildren = children.filter((child) => child.id !== targetId);
      setChildren(nextChildren);
      setEditingChildId(null);
      setChildNameInput("");
      setChildDateOfBirthInput("");
      notify("Child removed.", "success");

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
      notify("Could not remove child.", "error");
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
      notify("Activity logged!", "success");

      await refreshChildData(Number(selectedChildId));
    } catch {
      notify("Could not save activity.", "error");
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

  const openAddActivityModal = (suggestion?: {
    title: string;
    description: string;
  }) => {
    if (!selectedChildId) {
      notify("Add a child first before logging an activity.", "warning");
      return;
    }
    setEditingActivityId(null);
    setTitle(suggestion?.title || "");
    setNotes(suggestion?.description || "");
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

  const openReflectionModal = async () => {
    if (!selectedChild) {
      notify("Add a child first before writing a reflection.", "warning");
      return;
    }

    // Calculate Monday of current week
    const today = dayjs();
    const weekStart = today.startOf("week").add(1, "day"); // Monday

    try {
      // Use the new weekly reflection endpoint
      const response = await api.get(
        `/reflections/weekly/${selectedChild.id}/${weekStart.format("YYYY-MM-DD")}/`,
      );
      setReflectionNote(response.data.content || "");
      setReflectionModalOpen(true);
    } catch (err) {
      const error = err as { response?: { data: unknown; status: number } };
      console.error("Error loading reflection:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      setReflectionNote("");
      setReflectionModalOpen(true);
    }
  };

  const saveReflection = async () => {
    if (!selectedChild) return;

    const today = dayjs();
    const weekStart = today.startOf("week").add(1, "day"); // Monday

    try {
      // Use the new weekly reflection endpoint that handles create/update
      await api.post(
        `/reflections/weekly/${selectedChild.id}/${weekStart.format("YYYY-MM-DD")}/`,
        {
          content: reflectionNote,
        },
      );

      setReflectionModalOpen(false);
      notify("Reflection saved! ✨", "success");
    } catch (err) {
      const error = err as { response?: { data: unknown; status: number } };
      console.error("Error saving reflection:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      notify("Failed to save reflection. Please try again.", "error");
    }
  };

  const cancelReflection = () => {
    setReflectionModalOpen(false);
  };

  const updateActivity = async () => {
    if (!editingActivityId || !title) {
      return;
    }

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
      notify("Activity updated.", "success");

      if (selectedChildId) {
        await refreshChildData(Number(selectedChildId));
      }
    } catch {
      notify("Could not update activity.", "error");
    }
  };

  const deleteActivity = async (activityId: number) => {
    try {
      await api.delete(`/activities/${activityId}/`);
      notify("Activity deleted.", "success");

      if (selectedChildId) {
        await refreshChildData(Number(selectedChildId));
      }
    } catch {
      notify("Could not delete activity.", "error");
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
      notify("Could not load suggestions.", "error");
    }
  };

  if (!token) {
    // Auth form requested (Sign In / Start Free clicked)
    if (showAuth) {
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

    // Marketing landing page
    return (
      <LandingPage
        onStartFree={() => {
          setMode("signup");
          setShowAuth(true);
        }}
        onSignIn={() => {
          setMode("login");
          setShowAuth(true);
        }}
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
        <SuggestionsPage
          selectedChild={selectedChild}
          onOpenActivityModal={openAddActivityModal}
          isPlus={isPlus}
          onNavigateToPricing={() => setCurrentPage("pricing")}
        />
      ) : currentPage === "reports" ? (
        <ReportsPage
          selectedChild={selectedChild}
          isPlus={isPlus}
          onNavigateToPricing={() => setCurrentPage("pricing")}
        />
      ) : currentPage === "pricing" ? (
        <PricingPage
          isPlus={isPlus}
          onNavigate={(page) => setCurrentPage(page as PageType)}
        />
      ) : currentPage === "settings" ? (
        <SettingsPage
          email={email}
          plan={plan}
          children={children}
          isPlus={isPlus}
          maxChildren={maxChildren}
          onLogout={() => setToken(null)}
          onNavigateToPricing={() => setCurrentPage("pricing")}
          onNavigateToChildren={() => setCurrentPage("children")}
        />
      ) : currentPage === "children" ? (
        <ChildrenPage
          children={children}
          selectedChildId={selectedChildId}
          childNameInput={childNameInput}
          childDateOfBirthInput={childDateOfBirthInput}
          isEditingChild={isEditingChild}
          onSelectedChildChange={onSelectedChildChange}
          onChildNameChange={setChildNameInput}
          onChildDateOfBirthChange={setChildDateOfBirthInput}
          onAddChild={addChild}
          onStartEditChild={startEditChild}
          onUpdateChild={updateChild}
          onCancelEdit={cancelEditChild}
          onDeleteChild={deleteChild}
          isPlus={isPlus}
          maxChildren={maxChildren}
          childCount={children.length}
          onNavigateToPricing={() => setCurrentPage("pricing")}
        />
      ) : currentPage === "activities" ? (
        <ActivitiesPage selectedChild={selectedChild} />
      ) : (
        <Container maxWidth="xl">
          <Box sx={{ px: { xs: 1, md: 2 }, py: { xs: 2, md: 2.5 } }}>
            {children.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  pt: { xs: 6, md: 10 },
                  pb: 4,
                }}
              >
                <Typography sx={{ fontSize: 64, lineHeight: 1, mb: 3 }}>
                  🌱
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="#2d3748"
                  sx={{ mb: 1.5 }}
                >
                  Welcome to EarlyLedge!
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, maxWidth: 480 }}
                >
                  Before you can log activities or write reflections, you need
                  to add your child. It only takes a few seconds.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setCurrentPage("children")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 2,
                    bgcolor: "#67b587",
                    "&:hover": { bgcolor: "#5a9a74" },
                  }}
                >
                  Add your first child
                </Button>
              </Box>
            ) : (
              <>
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

                      {/* Add Activity and Find Activity buttons on mobile */}
                      {isMobile && (
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => openAddActivityModal()}
                            sx={{
                              flex: 1,
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 600,
                              bgcolor: "#67b587",
                              "&:hover": {
                                bgcolor: "#5a9a74",
                              },
                            }}
                          >
                            Add Activity
                          </Button>
                          <Button
                            variant="outlined"
                            size="large"
                            startIcon={<SearchIcon />}
                            onClick={() => setCurrentPage("suggestions")}
                            sx={{
                              flex: 1,
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 600,
                              borderColor: "#67b587",
                              color: "#67b587",
                              "&:hover": {
                                borderColor: "#5a9a74",
                                bgcolor: "rgba(103, 181, 135, 0.1)",
                              },
                            }}
                          >
                            Find Activity
                          </Button>
                        </Box>
                      )}

                      <ActivitiesListCard
                        activities={activities}
                        onEditActivity={startEditActivity}
                        onDeleteActivity={deleteActivity}
                        onViewAllActivities={() => setCurrentPage("activities")}
                      />

                      <SuggestionsCard suggestions={suggestions} />
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, lg: 4 }}>
                    <Stack spacing={3}>
                      {/* Add Activity and Find Activity buttons - desktop only */}
                      {!isMobile && (
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => openAddActivityModal()}
                            sx={{
                              flex: 1,
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 600,
                              bgcolor: "#67b587",
                              "&:hover": {
                                bgcolor: "#5a9a74",
                              },
                            }}
                          >
                            Add Activity
                          </Button>
                          <Button
                            variant="outlined"
                            size="large"
                            startIcon={<SearchIcon />}
                            onClick={() => setCurrentPage("suggestions")}
                            sx={{
                              flex: 1,
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 600,
                              borderColor: "#67b587",
                              color: "#67b587",
                              "&:hover": {
                                borderColor: "#5a9a74",
                                bgcolor: "rgba(103, 181, 135, 0.1)",
                              },
                            }}
                          >
                            Find Activity
                          </Button>
                        </Box>
                      )}

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
                            What was a highlight of your child&apos;s learning
                            this week?
                          </Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={openReflectionModal}
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
              </>
            )}
          </Box>
        </Container>
      )}

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

      <Dialog
        open={reflectionModalOpen}
        onClose={cancelReflection}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle>
          <Typography
            component="span"
            variant="h6"
            fontWeight={700}
            color="#2d3748"
          >
            Weekly Reflection
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            What was a highlight of your child's learning this week?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={reflectionNote}
            onChange={(e) => setReflectionNote(e.target.value)}
            placeholder="Share your thoughts about this week's learning moments..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={cancelReflection} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={saveReflection}
            variant="contained"
            sx={{
              bgcolor: "#67b587",
              "&:hover": { bgcolor: "#5a9a74" },
            }}
          >
            Save Reflection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
