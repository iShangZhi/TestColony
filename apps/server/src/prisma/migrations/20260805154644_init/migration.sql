-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "avatar_url" VARCHAR(500),
    "role" VARCHAR(20) NOT NULL DEFAULT 'member',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "owner_id" UUID NOT NULL,
    "repository_url" VARCHAR(500),
    "settings" JSONB NOT NULL DEFAULT '{}',
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prds" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "version" VARCHAR(50) NOT NULL DEFAULT '1.0',
    "content" TEXT NOT NULL,
    "file_path" VARCHAR(500),
    "parsed_requirements" JSONB NOT NULL DEFAULT '[]',
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "prds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_suites" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "test_suites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_cases" (
    "id" UUID NOT NULL,
    "test_suite_id" UUID NOT NULL,
    "prd_id" UUID,
    "external_id" VARCHAR(50),
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "preconditions" TEXT,
    "test_steps" JSONB NOT NULL DEFAULT '[]',
    "expected_result" TEXT,
    "priority" VARCHAR(10) NOT NULL DEFAULT 'P2',
    "category" VARCHAR(50),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "automation_status" VARCHAR(20) NOT NULL DEFAULT 'manual',
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "source" VARCHAR(20) NOT NULL DEFAULT 'manual',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_runs" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "test_suite_id" UUID,
    "name" VARCHAR(200),
    "trigger_type" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "total_cases" INTEGER NOT NULL DEFAULT 0,
    "passed_cases" INTEGER NOT NULL DEFAULT 0,
    "failed_cases" INTEGER NOT NULL DEFAULT 0,
    "skipped_cases" INTEGER NOT NULL DEFAULT 0,
    "error_cases" INTEGER NOT NULL DEFAULT 0,
    "duration_ms" INTEGER,
    "report_path" VARCHAR(500),
    "triggered_by" UUID,
    "agent_session_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" UUID NOT NULL,
    "test_run_id" UUID NOT NULL,
    "test_case_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "duration_ms" INTEGER,
    "error_message" TEXT,
    "stack_trace" TEXT,
    "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "logs" TEXT,
    "ai_analysis" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "executed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_definitions" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "system_prompt" TEXT NOT NULL,
    "model" VARCHAR(50) NOT NULL DEFAULT 'deepseek-chat',
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "max_tokens" INTEGER NOT NULL DEFAULT 8192,
    "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hooks_config" JSONB NOT NULL DEFAULT '{}',
    "subagent_config" JSONB NOT NULL DEFAULT '{}',
    "memory_mode" VARCHAR(20) NOT NULL DEFAULT 'session',
    "file_path" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "agent_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_definitions" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "body" TEXT NOT NULL,
    "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "context_mode" VARCHAR(20) NOT NULL DEFAULT 'inline',
    "disable_model_invocation" BOOLEAN NOT NULL DEFAULT false,
    "file_path" VARCHAR(500),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "skill_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_to_skills" (
    "id" UUID NOT NULL,
    "agent_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_to_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_sessions" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "agent_definition_id" UUID,
    "parent_session_id" UUID,
    "name" VARCHAR(200),
    "agent_type" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'initializing',
    "model" VARCHAR(50),
    "token_count" INTEGER NOT NULL DEFAULT 0,
    "max_tokens" INTEGER NOT NULL DEFAULT 128000,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "context_snapshot" JSONB NOT NULL DEFAULT '{}',
    "summary" TEXT,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "duration_ms" INTEGER,
    "error_message" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_messages" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT,
    "tool_calls" JSONB,
    "tool_call_id" VARCHAR(100),
    "tool_name" VARCHAR(100),
    "token_count" INTEGER,
    "sequence_num" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_interactions" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "priority" VARCHAR(10) NOT NULL DEFAULT 'normal',
    "title" VARCHAR(300),
    "message" TEXT NOT NULL,
    "context_data" JSONB NOT NULL DEFAULT '{}',
    "options" JSONB,
    "response" TEXT,
    "responded_by" UUID,
    "responded_at" TIMESTAMPTZ,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "timeout_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(50),
    "entity_id" UUID,
    "details" JSONB NOT NULL DEFAULT '{}',
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_project_id_user_id_key" ON "project_members"("project_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "agent_definitions_project_id_name_key" ON "agent_definitions"("project_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "skill_definitions_project_id_name_key" ON "skill_definitions"("project_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "agent_to_skills_agent_id_skill_id_key" ON "agent_to_skills"("agent_id", "skill_id");

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prds" ADD CONSTRAINT "prds_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prds" ADD CONSTRAINT "prds_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_suites" ADD CONSTRAINT "test_suites_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_suites" ADD CONSTRAINT "test_suites_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "test_suites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_test_suite_id_fkey" FOREIGN KEY ("test_suite_id") REFERENCES "test_suites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_prd_id_fkey" FOREIGN KEY ("prd_id") REFERENCES "prds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_test_suite_id_fkey" FOREIGN KEY ("test_suite_id") REFERENCES "test_suites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_triggered_by_fkey" FOREIGN KEY ("triggered_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_agent_session_id_fkey" FOREIGN KEY ("agent_session_id") REFERENCES "agent_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_test_run_id_fkey" FOREIGN KEY ("test_run_id") REFERENCES "test_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_definitions" ADD CONSTRAINT "agent_definitions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_definitions" ADD CONSTRAINT "skill_definitions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_to_skills" ADD CONSTRAINT "agent_to_skills_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agent_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_to_skills" ADD CONSTRAINT "agent_to_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_sessions" ADD CONSTRAINT "agent_sessions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_sessions" ADD CONSTRAINT "agent_sessions_agent_definition_id_fkey" FOREIGN KEY ("agent_definition_id") REFERENCES "agent_definitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_sessions" ADD CONSTRAINT "agent_sessions_parent_session_id_fkey" FOREIGN KEY ("parent_session_id") REFERENCES "agent_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_messages" ADD CONSTRAINT "agent_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "agent_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "agent_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interactions" ADD CONSTRAINT "user_interactions_responded_by_fkey" FOREIGN KEY ("responded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
