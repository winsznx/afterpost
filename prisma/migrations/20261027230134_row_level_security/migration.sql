-- Row-Level Security (PRD §2.2: "Access is enforced on the server for
-- every org-scoped query, not merely hidden in the UI" — this is the
-- database-level half of that; the application-layer checks in
-- apps/api/src/http/middleware/auth.ts are the other half, intentionally
-- redundant with this).
--
-- Critical Postgres fact this migration exists because of: a table's
-- OWNER and any SUPERUSER role bypass Row-Level Security unconditionally,
-- regardless of any policy defined on the table. The role this database
-- was created with (set via POSTGRES_USER in docker-compose) is a
-- superuser. If the application connected as that role, every RLS policy
-- below would silently do nothing. A separate, deliberately unprivileged
-- role is required for RLS to have any real effect.

-- No password is set here on purpose — a role with LOGIN but no password
-- cannot authenticate at all, a safe default until an operator sets a real
-- one per environment (never committed; see infra/scripts/set-app-role-password.sh
-- and infra/env.example).
--
-- Guarded with an existence check, not a bare CREATE ROLE: Postgres roles
-- are cluster-wide, not scoped to one database. Prisma validates this
-- migration against a throwaway shadow database on the same cluster before
-- applying it for real, which executes this statement for real too — so by
-- the time the actual apply runs, the role already exists. An unguarded
-- CREATE ROLE fails migration validation on every fresh environment
-- (confirmed: this is exactly what happened running this locally).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'afterpost_app') THEN
    CREATE ROLE afterpost_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
  END IF;
END $$;

GRANT CONNECT ON DATABASE afterpost TO afterpost_app;
GRANT USAGE ON SCHEMA public TO afterpost_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO afterpost_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO afterpost_app;

-- Future tables created by later migrations (run as the superuser role)
-- are automatically granted to afterpost_app without a manual GRANT each time.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO afterpost_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO afterpost_app;

-- One policy shape, applied to every table that carries a direct
-- workspace_id column. workspace_id is Postgres `text` here, not a native
-- `uuid` column (Prisma's `String @id @default(uuid())` maps to text) —
-- no cast needed, and an earlier `::uuid` cast attempt failed migration
-- validation with exactly this type mismatch.
-- `current_setting(..., true)` returns NULL rather than erroring when
-- unset, and NULLIF guards against an empty string — either way the
-- policy evaluates to NULL (falsy), so a request that forgets to set the
-- session variable sees zero rows / fails every write, a safe
-- default-deny rather than an accidental default-allow.
DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'workspace_members', 'workspace_invites', 'projects', 'tokens', 'partners',
    'campaigns', 'evidence', 'wallet_labels', 'source_health', 'tracking_links',
    'wallet_campaign_associations', 'qualifying_conversions', 'investigation_runs',
    'reports', 'world_model_events', 'memory_records', 'audit_events',
    'notifications', 'integration_connections'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', tbl);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I USING (workspace_id = NULLIF(current_setting(''app.workspace_id'', true), '''')) WITH CHECK (workspace_id = NULLIF(current_setting(''app.workspace_id'', true), ''''))',
      tbl
    );
  END LOOP;
END $$;
