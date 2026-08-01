/**
 * Hand-authored ground truth for the trigger suite.
 *
 * For each of the 97 prompts in `./prompts.ts`, this records which of the two
 * closed-set skills SHOULD have their full instructions loaded by a well-
 * calibrated agent acting on the prompt text alone (the clean-run signal;
 * noisy-context runs add distractor messages but the trigger decision is
 * still driven by the user's actual question).
 *
 * The closed set is two skills:
 *   - supabase                         (broad Supabase catch-all)
 *   - supabase-postgres-best-practices (Postgres mechanics: query/schema/
 *                                       index/connection/RLS/locking/data/
 *                                       monitoring best practices)
 *
 * Authoring rule:
 *   supabase ∈ expected  iff the prompt carries a Supabase signal — the word
 *     "Supabase" or an unmistakable Supabase-only concern (Firebase migration,
 *     Supabase auth, Supabase connection limits). Generic-Postgres phrasings
 *     ("how do I avoid deadlocks in postgres") carry no Supabase signal, so a
 *     correct agent does NOT fire the broad skill on them. This is the
 *     discriminative signal the suite measures: does the model over-fire the
 *     broad catch-all on pure-Postgres prompts?
 *   supabase-postgres-best-practices ∈ expected  iff the prompt is about
 *     Postgres mechanics the reference rules cover (the 7 mechanics categories
 *     plus general prompts with a concrete perf/schema/RLS/limits angle).
 *     Pure onboarding/migration-setup questions ("I'm new to Supabase, where
 *     do I start", "migrating from Firebase to Supabase") are Supabase-meta,
 *     not Postgres mechanics, so P is NOT expected on them.
 *
 * This is ground truth. The devtool's old `matrix.json` is a discarded
 * predictor snapshot (a cheap model simulating activation) and is NOT used
 * here — it had no human-verified labels.
 */
import type { Category } from './prompts.js';

export const SKILL_SUPABASE = 'supabase';
export const SKILL_POSTGRES = 'supabase-postgres-best-practices';

/** The closed set of skills the trigger suite exercises. */
export const TRIGGER_SKILLS = [SKILL_SUPABASE, SKILL_POSTGRES] as const;

export type GoldenEntry = {
  promptIndex: number;
  category: Category;
  expectedSkills: readonly string[];
  notes?: string;
};

const S = SKILL_SUPABASE;
const P = SKILL_POSTGRES;

// Helper for the common case: a pure-Postgres-mechanics prompt → P only.
const p = (i: number, category: Category): GoldenEntry => ({
  promptIndex: i,
  category,
  expectedSkills: [P],
});

export const golden: GoldenEntry[] = [
  // ── Schema (0–19): all are schema-design → P. Only #0 names Supabase → S+P. ──
  {
    promptIndex: 0,
    category: 'schema',
    expectedSkills: [S, P],
    notes:
      'names Supabase; table creation is schema design (PK/lowercase/types/constraints)',
  },
  p(1, 'schema'),
  p(2, 'schema'),
  p(3, 'schema'),
  p(4, 'schema'),
  p(5, 'schema'),
  p(6, 'schema'),
  p(7, 'schema'),
  p(8, 'schema'),
  p(9, 'schema'),
  p(10, 'schema'),
  p(11, 'schema'),
  p(12, 'schema'),
  p(13, 'schema'),
  p(14, 'schema'),
  p(15, 'schema'),
  p(16, 'schema'),
  p(17, 'schema'),
  p(18, 'schema'),
  p(19, 'schema'),

  // ── Security/RLS (20–32): RLS + privileges → P. None name Supabase. ──
  p(20, 'security'),
  p(21, 'security'),
  p(22, 'security'),
  p(23, 'security'),
  p(24, 'security'),
  {
    promptIndex: 25,
    category: 'security',
    expectedSkills: [P],
    notes: 'RLS performance — security-rls-performance ref',
  },
  p(26, 'security'),
  p(27, 'security'),
  p(28, 'security'),
  p(29, 'security'),
  p(30, 'security'),
  p(31, 'security'),
  p(32, 'security'),

  // ── Performance (33–48): query/index → P. None name Supabase. ──
  p(33, 'performance'),
  p(34, 'performance'),
  p(35, 'performance'),
  {
    promptIndex: 36,
    category: 'performance',
    expectedSkills: [P],
    notes: 'data-n-plus-one ref',
  },
  {
    promptIndex: 37,
    category: 'performance',
    expectedSkills: [P],
    notes: 'data-pagination ref',
  },
  {
    promptIndex: 38,
    category: 'performance',
    expectedSkills: [P],
    notes: 'advanced-full-text-search ref',
  },
  {
    promptIndex: 39,
    category: 'performance',
    expectedSkills: [P],
    notes: 'advanced-jsonb-indexing ref',
  },
  {
    promptIndex: 40,
    category: 'performance',
    expectedSkills: [P],
    notes: 'query-composite-indexes ref',
  },
  {
    promptIndex: 41,
    category: 'performance',
    expectedSkills: [P],
    notes: 'query-partial-indexes ref',
  },
  p(42, 'performance'),
  p(43, 'performance'),
  {
    promptIndex: 44,
    category: 'performance',
    expectedSkills: [P],
    notes: 'partial/low-cardinality index',
  },
  p(45, 'performance'),
  p(46, 'performance'),
  {
    promptIndex: 47,
    category: 'performance',
    expectedSkills: [P],
    notes: 'query-index-types ref',
  },
  p(48, 'performance'),

  // ── Connections (49–59): pooling/limits → P. Only #56 names Supabase → S+P. ──
  p(49, 'connections'),
  p(50, 'connections'),
  p(51, 'connections'),
  p(52, 'connections'),
  p(53, 'connections'),
  p(54, 'connections'),
  p(55, 'connections'),
  {
    promptIndex: 56,
    category: 'connections',
    expectedSkills: [S, P],
    notes: 'names Supabase; conn-limits ref',
  },
  p(57, 'connections'),
  p(58, 'connections'),
  p(59, 'connections'),

  // ── Data-ops (60–69): batch/upsert/pagination → P. None name Supabase. ──
  p(60, 'data-ops'),
  p(61, 'data-ops'),
  p(62, 'data-ops'),
  p(63, 'data-ops'),
  p(64, 'data-ops'),
  p(65, 'data-ops'),
  p(66, 'data-ops'),
  p(67, 'data-ops'),
  p(68, 'data-ops'),
  p(69, 'data-ops'),

  // ── Locking (70–78): concurrency/locks → P. None name Supabase. ──
  p(70, 'locking'),
  p(71, 'locking'),
  p(72, 'locking'),
  p(73, 'locking'),
  p(74, 'locking'),
  p(75, 'locking'),
  p(76, 'locking'),
  p(77, 'locking'),
  {
    promptIndex: 78,
    category: 'locking',
    expectedSkills: [P],
    notes:
      'migrations-without-downtime = lock-short-transactions; generic, no Supabase signal',
  },

  // ── Monitoring (79–86): explain/vacuum/pg_stat → P. None name Supabase. ──
  p(79, 'monitoring'),
  p(80, 'monitoring'),
  p(81, 'monitoring'),
  p(82, 'monitoring'),
  p(83, 'monitoring'),
  p(84, 'monitoring'),
  p(85, 'monitoring'),
  p(86, 'monitoring'),

  // ── General (87–96): Supabase-meta vs Postgres-mechanics. ──
  {
    promptIndex: 87,
    category: 'general',
    expectedSkills: [S],
    notes: 'new Supabase app — onboarding, no specific Postgres mechanics',
  },
  {
    promptIndex: 88,
    category: 'general',
    expectedSkills: [S, P],
    notes: 'names Supabase; "database running slow" = performance → P',
  },
  {
    promptIndex: 89,
    category: 'general',
    expectedSkills: [S, P],
    notes:
      'names Supabase; "best practices" matches the P skill namesake; borderline — broad project guidance',
  },
  {
    promptIndex: 90,
    category: 'general',
    expectedSkills: [S],
    notes: 'onboarding, no Postgres mechanics',
  },
  {
    promptIndex: 91,
    category: 'general',
    expectedSkills: [P],
    notes:
      'no Supabase mention; "structure database schema" = schema design → P',
  },
  {
    promptIndex: 92,
    category: 'general',
    expectedSkills: [S],
    notes:
      'names Supabase; Firebase→Supabase migration is Supabase-meta, not Postgres mechanics',
  },
  {
    promptIndex: 93,
    category: 'general',
    expectedSkills: [S],
    notes:
      'names Supabase; SaaS setup is broad, no specific Postgres mechanics',
  },
  {
    promptIndex: 94,
    category: 'general',
    expectedSkills: [S, P],
    notes: 'names Supabase + auth; auth-with-tables = RLS (auth.uid) → P',
  },
  {
    promptIndex: 95,
    category: 'general',
    expectedSkills: [S, P],
    notes: 'names Supabase; "optimize database" = performance → P',
  },
  {
    promptIndex: 96,
    category: 'general',
    expectedSkills: [S, P],
    notes: 'names Supabase; "database limits" = connection/resource limits → P',
  },
];

/** Invariant check (run by the gen script + tests): one entry per prompt, in order. */
export function assertGoldenCoversAll(
  prompts: { text: string; category: Category }[]
): void {
  if (golden.length !== prompts.length) {
    throw new Error(
      `golden has ${golden.length} entries; prompts has ${prompts.length}`
    );
  }
  for (let i = 0; i < golden.length; i++) {
    if (golden[i].promptIndex !== i) {
      throw new Error(
        `golden[${i}].promptIndex=${golden[i].promptIndex}, expected ${i}`
      );
    }
  }
}
