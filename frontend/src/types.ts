export type Skill = {
  id: number;
  name: string;
};

export type Child = {
  id: number;
  name: string;
  age: number;
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
