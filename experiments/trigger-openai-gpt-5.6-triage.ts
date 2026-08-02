import { createOpenAI } from '@ai-sdk/openai';
import {
  aiSdkAgent,
  defineExperiment,
  platformLiteRuntime,
  supabaseMcpServer,
} from '@supabase-evals/core';

// Same model/routing as trigger-openai-gpt-5.6.ts (the 31/38 baseline) but with
// supabase-triage added to the available skills and run against the parallel
// `triage` eval suite (investigate-triage-*), whose scorer expects
// supabase-triage on the 18 investigate/resolve prompts. Compares whether a
// 3rd, symptom-driven skill improves trigger discrimination over the 2-skill
// baseline.
const model = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})('openai/gpt-5.6-terra');

export default defineExperiment({
  suite: ['triage'],
  agent: aiSdkAgent({
    model,
    providerOptions: {
      openai: {
        textVerbosity: 'low',
      },
    },
  }),
  runtime: platformLiteRuntime({
    mcpServers: [supabaseMcpServer()],
  }),
  skills: ['supabase', 'supabase-postgres-best-practices', 'supabase-triage'],
});