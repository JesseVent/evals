import { anthropic } from '@ai-sdk/anthropic';
import {
  aiSdkAgent,
  defineExperiment,
  platformLiteRuntime,
  supabaseMcpServer,
} from '@supabase-evals/core';

// Skill-trigger suite: measures whether the agent loads the right skills from
// their descriptions alone (clean run) and under a noisy context window
// (`--noisy-context`). Tools mode, in-process ai-sdk agent (no sandbox) — the
// scorer is deterministic (`createSkillTriggerScorer` in each EVAL.ts) and only
// reads which skills loaded, so no localStack/runtime DB surface is exercised.
export default defineExperiment({
  suite: ['trigger'],
  agent: aiSdkAgent({
    model: anthropic('claude-sonnet-5'),
    providerOptions: {
      anthropic: { effort: 'max' },
    },
  }),
  runtime: platformLiteRuntime({
    mcpServers: [supabaseMcpServer()],
  }),
  skills: ['supabase', 'supabase-postgres-best-practices'],
});
