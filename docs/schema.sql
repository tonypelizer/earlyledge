-- EarlyLedge MVP core schema (PostgreSQL)

CREATE TABLE core_user (
  id BIGSERIAL PRIMARY KEY,
  password VARCHAR(128) NOT NULL,
  last_login TIMESTAMPTZ NULL,
  is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
  first_name VARCHAR(150) NOT NULL DEFAULT '',
  last_name VARCHAR(150) NOT NULL DEFAULT '',
  is_staff BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  date_joined TIMESTAMPTZ NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE core_child (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES core_user(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE core_skillcategory (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE core_activity (
  id BIGSERIAL PRIMARY KEY,
  child_id BIGINT NOT NULL REFERENCES core_child(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  duration_minutes INTEGER NULL CHECK (duration_minutes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activity_date DATE NOT NULL
);

CREATE TABLE core_activityskill (
  id BIGSERIAL PRIMARY KEY,
  activity_id BIGINT NOT NULL REFERENCES core_activity(id) ON DELETE CASCADE,
  skill_id BIGINT NOT NULL REFERENCES core_skillcategory(id) ON DELETE CASCADE,
  UNIQUE (activity_id, skill_id)
);

CREATE TABLE core_suggestion (
  id BIGSERIAL PRIMARY KEY,
  skill_id BIGINT NOT NULL REFERENCES core_skillcategory(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  min_age INTEGER NOT NULL CHECK (min_age >= 0),
  max_age INTEGER NOT NULL CHECK (max_age >= min_age)
);

CREATE INDEX idx_child_user_id ON core_child (user_id);
CREATE INDEX idx_activity_child_id ON core_activity (child_id);
CREATE INDEX idx_activity_date ON core_activity (activity_date);
CREATE INDEX idx_activityskill_activity_id ON core_activityskill (activity_id);
CREATE INDEX idx_activityskill_skill_id ON core_activityskill (skill_id);
CREATE INDEX idx_suggestion_skill_id ON core_suggestion (skill_id);
