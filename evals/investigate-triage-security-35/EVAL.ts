import { createSkillTriggerScorer } from '@supabase-evals/core';

// ponytail: closed skill set inlined so this eval dir is self-contained and
// does not import the trigger data files at runtime. Canonical list lives in
// evals/trigger/golden-triage.ts (TRIAGE_SKILLS).
const TRIGGER_SKILLS = [
  'supabase',
  'supabase-postgres-best-practices',
  'supabase-triage',
] as const;

export default createSkillTriggerScorer(['supabase', 'supabase-postgres-best-practices', 'supabase-triage'], TRIGGER_SKILLS);
