#!/usr/bin/env tsx
/**
 * One-shot codegen for the triage trigger suite — a 3-skill variant of
 * gen-trigger-evals.ts. Reads the same 38 prompts (`evals/trigger/prompts.ts`)
 * and `evals/trigger/golden-triage.ts` (which layers `supabase-triage` onto the
 * base golden), and emits one self-contained eval dir per prompt:
 *
 *   evals/investigate-triage-<category>-<nn>/{PROMPT.md, EVAL.ts}
 *
 * Identical to the trigger suite except: `suite: triage` frontmatter and the
 * closed skill set inlined into each EVAL.ts is the 3-skill TRIAGE_SKILLS
 * ([supabase, supabase-postgres-best-practices, supabase-triage]). Run once and
 * commit the output.
 *
 *   cd apps/framework && node --import tsx/esm scripts/gen-triage-evals.ts
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { prompts, type Category } from '../../../evals/trigger/prompts.js';
import { goldenTriage, TRIAGE_SKILLS } from '../../../evals/trigger/golden-triage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..', '..');
const EVALS_DIR = join(ROOT, 'evals');

// Closed skill set — inlined into every generated EVAL.ts. Canonical home:
// evals/trigger/golden-triage.ts (TRIAGE_SKILLS). Multi-line form matches
// biome's formatter so re-runs are clean.
const TRIAGE_SKILLS_LITERAL = `[
  'supabase',
  'supabase-postgres-best-practices',
  'supabase-triage',
] as const`;

/** Map a prompt category to the frontmatter `topic` benchmark dimension. */
function topicFor(category: Category): string {
  switch (category) {
    case 'security':
      return 'rls';
    case 'schema':
    case 'performance':
    case 'data-ops':
      return 'sql';
    case 'monitoring':
    case 'general':
      return 'observability';
  }
}

/** Quote a skill name as a TypeScript string literal. */
const q = (s: string): string => `'${s}'`;

function promptMarkdown(text: string, category: Category): string {
  return `---
stage: investigate
suite: triage
interface: mcp
product:
  - database
topic:
  - ${topicFor(category)}
---

${text}
`;
}

function evalTs(expectedSkills: readonly string[]): string {
  const expected = `[${expectedSkills.map(q).join(', ')}]`;
  return `import { createSkillTriggerScorer } from '@supabase-evals/core';

// ponytail: closed skill set inlined so this eval dir is self-contained and
// does not import the trigger data files at runtime. Canonical list lives in
// evals/trigger/golden-triage.ts (TRIAGE_SKILLS).
const TRIGGER_SKILLS = ${TRIAGE_SKILLS_LITERAL};

export default createSkillTriggerScorer(${expected}, TRIGGER_SKILLS);
`;
}

async function main() {
  // Structural invariant: goldenTriage is derived from golden (which already
  // covers all prompts in order), so this is a cheap belt-and-braces check.
  if (goldenTriage.length !== prompts.length) {
    throw new Error(
      `goldenTriage has ${goldenTriage.length} entries; prompts has ${prompts.length}`
    );
  }
  for (let i = 0; i < goldenTriage.length; i++) {
    if (goldenTriage[i].promptIndex !== i) {
      throw new Error(
        `goldenTriage[${i}].promptIndex=${goldenTriage[i].promptIndex}, expected ${i}`
      );
    }
  }

  const generatedPrefix = 'investigate-triage-';
  let cleared = 0;
  for (const g of goldenTriage) {
    const dir = join(
      EVALS_DIR,
      `${generatedPrefix}${g.category}-${String(g.promptIndex).padStart(2, '0')}`
    );
    await rm(dir, { recursive: true, force: true });
    cleared += 1;
  }

  let written = 0;
  for (const g of goldenTriage) {
    const prompt = prompts[g.promptIndex];
    const dirName = `${generatedPrefix}${g.category}-${String(g.promptIndex).padStart(2, '0')}`;
    const dir = join(EVALS_DIR, dirName);
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, 'PROMPT.md'),
      promptMarkdown(prompt.text, g.category),
      'utf8'
    );
    await writeFile(join(dir, 'EVAL.ts'), evalTs(g.expectedSkills), 'utf8');
    written += 1;
  }

  const triageCount = goldenTriage.filter((g) =>
    g.expectedSkills.includes(TRIAGE_SKILLS[2])
  ).length;
  console.log(
    `cleared ${cleared} prior dirs, wrote ${written} triage eval dirs (${triageCount} expect supabase-triage) under evals/`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});