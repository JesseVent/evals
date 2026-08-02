/**
 * GENERATED from golden-triage.tsv by build-golden.ts — do not hand-edit.
 * To change an expectation: edit the TSV (1/0 per skill column), then run:
 *   cd apps/framework && node --import tsx/esm scripts/build-golden.ts triage
 */
import type { Category } from './prompts.js';
import type { GoldenEntry } from './golden.js';

export const TRIAGE_SKILLS = ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'] as const;

export const goldenTriage: GoldenEntry[] = [
  { promptIndex: 0, category: "general" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-cli-001-bootstrap-app" },
  { promptIndex: 1, category: "schema" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-cli-002-declarative-schema" },
  { promptIndex: 2, category: "general" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-cli-003-pg-cron-queue-workflow" },
  { promptIndex: 3, category: "schema" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-database-001-migrate-postgres-to-supabase" },
  { promptIndex: 4, category: "general" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-frontend-001-todos-app" },
  { promptIndex: 5, category: "general" as Category, expectedSkills: ['supabase'], sourceEval: "build-functions-001-order-total" },
  { promptIndex: 6, category: "general" as Category, expectedSkills: ['supabase'], sourceEval: "build-functions-002-edge-auth-db" },
  { promptIndex: 7, category: "general" as Category, expectedSkills: ['supabase'], sourceEval: "build-functions-003-todos-crud-api" },
  { promptIndex: 8, category: "security" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-functions-004-service-role-bypass" },
  { promptIndex: 9, category: "security" as Category, expectedSkills: ['supabase'], sourceEval: "build-functions-005-dual-auth-user-secret" },
  { promptIndex: 10, category: "security" as Category, expectedSkills: ['supabase'], sourceEval: "build-functions-006-dual-auth-with-server" },
  { promptIndex: 11, category: "general" as Category, expectedSkills: ['supabase'], sourceEval: "build-realtime-001-live-chat-updates" },
  { promptIndex: 12, category: "security" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-rls-002-own-todos-client" },
  { promptIndex: 13, category: "security" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-rls-003-org-roles-permissions" },
  { promptIndex: 14, category: "security" as Category, expectedSkills: ['supabase'], sourceEval: "build-storage-001-private-bucket-access" },
  { promptIndex: 15, category: "security" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-tests-001-rls-tenant-isolation" },
  { promptIndex: 16, category: "schema" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "build-vectors-001-rag-with-permissions" },
  { promptIndex: 17, category: "monitoring" as Category, expectedSkills: ['supabase'], sourceEval: "deploy-database-001-prometheus-metrics" },
  { promptIndex: 18, category: "general" as Category, expectedSkills: ['supabase'], sourceEval: "deploy-functions-001-edge-function-secrets" },
  { promptIndex: 19, category: "general" as Category, expectedSkills: ['supabase'], sourceEval: "deploy-self-hosting-001-docker-compose" },
  { promptIndex: 20, category: "security" as Category, expectedSkills: ['supabase', 'supabase-triage'], sourceEval: "investigate-auth-001-deleted-user-access" },
  { promptIndex: 21, category: "schema" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "investigate-db-001-table-row-counts" },
  { promptIndex: 22, category: "monitoring" as Category, expectedSkills: ['supabase', 'supabase-triage'], sourceEval: "investigate-functions-001-546-resource-limit" },
  { promptIndex: 23, category: "monitoring" as Category, expectedSkills: ['supabase', 'supabase-triage'], sourceEval: "investigate-logs-001-top-error-function" },
  { promptIndex: 24, category: "general" as Category, expectedSkills: ['supabase', 'supabase-triage'], sourceEval: "investigate-realtime-001-subscribed-no-events" },
  { promptIndex: 25, category: "monitoring" as Category, expectedSkills: ['supabase', 'supabase-triage'], sourceEval: "investigate-reliability-001-error-rate-spike" },
  { promptIndex: 26, category: "monitoring" as Category, expectedSkills: ['supabase', 'supabase-triage'], sourceEval: "investigate-reliability-002-subtle-error-spike" },
  { promptIndex: 27, category: "monitoring" as Category, expectedSkills: ['supabase', 'supabase-triage'], sourceEval: "investigate-reliability-003-edge-function-5xx-correlation" },
  { promptIndex: 28, category: "security" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], sourceEval: "investigate-security-001-public-table" },
  { promptIndex: 29, category: "data-ops" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], sourceEval: "resolve-dataapi-001-empty-results" },
  { promptIndex: 30, category: "data-ops" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], sourceEval: "resolve-dataapi-002-secure-default-grants" },
  { promptIndex: 31, category: "data-ops" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], sourceEval: "resolve-dataapi-002-update-zero-rows-affected" },
  { promptIndex: 32, category: "schema" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices'], sourceEval: "resolve-database-001-migration-history-mismatch" },
  { promptIndex: 33, category: "performance" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], sourceEval: "resolve-performance-001-slow-query-cpu-spike" },
  { promptIndex: 34, category: "monitoring" as Category, expectedSkills: ['supabase', 'supabase-triage'], sourceEval: "resolve-reliability-001-unhealthy-project-recovery" },
  { promptIndex: 35, category: "security" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], sourceEval: "resolve-security-001-rls-cross-user-leak" },
  { promptIndex: 36, category: "security" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], sourceEval: "resolve-security-002-rls-cross-tenant-leak" },
  { promptIndex: 37, category: "security" as Category, expectedSkills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], sourceEval: "resolve-storage-001-upsert-missing-update-policy" },
];
