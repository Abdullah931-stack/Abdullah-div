-- ==============================================
-- Advanced Personal Page — Database Migration
-- Database: Supabase (PostgreSQL)
-- ==============================================

-- ─────────────────────────────────────────────
-- Social Links — Contact & Social Media
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "social_links" (
    "id"         TEXT    NOT NULL DEFAULT gen_random_uuid()::text,
    "platform"   TEXT    NOT NULL,
    "url"        TEXT    NOT NULL,
    "label_ar"   TEXT    NOT NULL,
    "label_en"   TEXT    NOT NULL,
    "icon"       TEXT,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "isActive"   BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────
-- Projects — Managed via CMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "projects" (
    "id"           TEXT    NOT NULL DEFAULT gen_random_uuid()::text,
    "slug"         TEXT    NOT NULL,
    "title_ar"     TEXT    NOT NULL,
    "title_en"     TEXT    NOT NULL,
    "summary_ar"   TEXT    NOT NULL,
    "summary_en"   TEXT    NOT NULL,
    "body_ar"      TEXT    NOT NULL,
    "body_en"      TEXT    NOT NULL,
    "preview_url"  TEXT,
    "skills"       TEXT[]  NOT NULL DEFAULT '{}',
    "build_time"   TEXT,
    "order"        INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_featured"  BOOLEAN NOT NULL DEFAULT false,
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "projects_slug_key" ON "projects"("slug");

-- ─────────────────────────────────────────────
-- Project Images
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "project_images" (
    "id"         TEXT    NOT NULL DEFAULT gen_random_uuid()::text,
    "url"        TEXT    NOT NULL,
    "alt_ar"     TEXT,
    "alt_en"     TEXT,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "project_id" TEXT    NOT NULL,
    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "project_images_project_id_fkey" FOREIGN KEY ("project_id")
        REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────
-- Timeline — Journey / The Story
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "timeline_entries" (
    "id"         TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
    "date"       TIMESTAMPTZ NOT NULL,
    "age"        INTEGER     NOT NULL,
    "title_ar"   TEXT        NOT NULL,
    "title_en"   TEXT        NOT NULL,
    "story_ar"   TEXT        NOT NULL,
    "story_en"   TEXT        NOT NULL,
    "image_url"  TEXT,
    "order"      INTEGER     NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "timeline_entries_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────
-- Survey Questions
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "survey_questions" (
    "id"          TEXT    NOT NULL DEFAULT gen_random_uuid()::text,
    "text_ar"     TEXT    NOT NULL,
    "text_en"     TEXT    NOT NULL,
    "type"        TEXT    NOT NULL,
    "options_ar"  TEXT[]  NOT NULL DEFAULT '{}',
    "options_en"  TEXT[]  NOT NULL DEFAULT '{}',
    "order"       INTEGER NOT NULL DEFAULT 0,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_active"   BOOLEAN NOT NULL DEFAULT true,
    "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "survey_questions_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────
-- Survey Responses
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "survey_responses" (
    "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "visitor_id"  TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "answer"      TEXT NOT NULL,
    "locale"      TEXT NOT NULL DEFAULT 'ar',
    "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "survey_responses_question_id_fkey" FOREIGN KEY ("question_id")
        REFERENCES "survey_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────
-- Messages — Smart Contact Form
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "messages" (
    "id"           TEXT    NOT NULL DEFAULT gen_random_uuid()::text,
    "sender_name"  TEXT    NOT NULL,
    "sender_email" TEXT    NOT NULL,
    "service_type" TEXT    NOT NULL,
    "budget"       TEXT    NOT NULL,
    "body"         TEXT    NOT NULL,
    "is_read"      BOOLEAN NOT NULL DEFAULT false,
    "email_status" TEXT    NOT NULL DEFAULT 'pending',
    "locale"       TEXT    NOT NULL DEFAULT 'ar',
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────
-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
-- ─────────────────────────────────────────────
ALTER TABLE "social_links"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_images"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "timeline_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "survey_questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "survey_responses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages"         ENABLE ROW LEVEL SECURITY;

-- Public SELECT for all read-only data
CREATE POLICY "public_read_social_links" ON "social_links"     FOR SELECT USING (true);
CREATE POLICY "public_read_projects"     ON "projects"         FOR SELECT USING (true);
CREATE POLICY "public_read_images"       ON "project_images"   FOR SELECT USING (true);
CREATE POLICY "public_read_timeline"     ON "timeline_entries" FOR SELECT USING (true);
CREATE POLICY "public_read_questions"    ON "survey_questions"  FOR SELECT USING (true);

-- Public INSERT for survey responses and messages (visitor-facing)
CREATE POLICY "public_insert_responses"  ON "survey_responses" FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_messages"   ON "messages"         FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access on all tables
CREATE POLICY "admin_all_social_links"    ON "social_links"     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_projects"        ON "projects"         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_images"          ON "project_images"   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_timeline"        ON "timeline_entries" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_questions"       ON "survey_questions" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_responses"       ON "survey_responses" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_messages"        ON "messages"         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_read_responses"      ON "survey_responses" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_read_messages"       ON "messages"         FOR SELECT USING (auth.role() = 'authenticated');
