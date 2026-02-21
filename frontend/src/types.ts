export type Skill = {
  id: number;
  name: string;
};

export type Child = {
  id: number;
  name: string;
  date_of_birth: string;
  age: number | null;
  created_at: string;
};

export type Activity = {
  id: number;
  child: number;
  title: string;
  notes: string;
  duration_minutes: number | null;
  activity_date: string;
  created_at: string;
  skills: Skill[];
};

export type WeeklyDashboard = {
  activity_count: number;
  skill_counts: { skill_id: number; skill: string; count: number }[];
  missing_skills: string[];
  recent_activities: {
    id: number;
    title: string;
    activity_date: string;
    duration_minutes: number | null;
    skills: string[];
  }[];
};

export type Suggestion = {
  id: number;
  skill: number;
  skill_name: string;
  title: string;
  description: string;
  min_age: number;
  max_age: number;
};

export type PlanInfo = {
  plan: "free" | "plus";
  is_plus: boolean;
  max_children: number;
  visibility_days: number | null;
  personalized_suggestions: boolean;
  printable_reports: boolean;
  long_term_trends: boolean;
  started_at: string | null;
  ends_at: string | null;
  upgrade_url: string;
};
