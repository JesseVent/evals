/**
 * Adapter from an eval run's recorded surface (`transcript` + `toolCalls` +
 * `skills` + `checks`) to the AgentPrism `TraceSpan` tree the web viewer
 * renders. Pure data: no React, no transport — the web `trace-panel` fetches
 * the serialized output of this function from `apps/web/src/data/traces/`.
 *
 * Pairing: `adaptTranscript` pushes `TranscriptPart`s (messages and tool
 * calls) and `ToolCallRecord`s in the same event order, so the i-th
 * `tool_call` part corresponds to `toolCalls[i]` (matched here by walking a
 * shared counter rather than by name, which isn't unique across runs).
 */

import type {
  TraceRecord,
  TraceSpan,
  TraceSpanAttribute,
  TraceSpanStatus,
} from '@evilmartians/agent-prism-types';
import type { CheckResult, SkillResult } from './eval-metadata.js';
import type { ToolCallRecord, TranscriptPart } from './index.js';

/** Plain-data badge the web layer maps to a styled `<Badge>`. */
export interface TraceBadge {
  label: string;
  tone: 'success' | 'error' | 'warning' | 'neutral';
}

export interface TraceViewerData {
  traceRecord: TraceRecord;
  spans: TraceSpan[];
  badges: TraceBadge[];
}

export interface EvalResultTraceInput {
  evalId: string;
  passed?: boolean;
  transcript?: TranscriptPart[];
  toolCalls?: ToolCallRecord[];
  agentReport?: string;
  skills?: SkillResult;
  checks?: CheckResult[];
  experimentDisplay?: {
    agent?: string;
    modelId?: string;
    modelProvider?: string;
  };
  attempts?: number;
}

export function evalResultToTraceSpans(
  input: EvalResultTraceInput
): TraceViewerData {
  const {
    evalId,
    passed,
    transcript = [],
    toolCalls = [],
    agentReport = '',
    skills,
    checks = [],
    experimentDisplay,
    attempts,
  } = input;

  const loaded = skills?.loaded ?? [];
  const available = skills?.available ?? [];

  const children: TraceSpan[] = [];
  let clock = 0; // monotonic fallback; bumped to a real `ts` when one is present
  let spanSeq = 0;
  let toolIdx = 0;
  const nextId = (prefix: string) => `${evalId}-${prefix}-${++spanSeq}`;

  for (const part of transcript) {
    if (part.type === 'message') {
      const isAssistant = part.role === 'assistant';
      children.push(
        makeSpan({
          id: nextId(isAssistant ? 'llm' : 'msg'),
          title: isAssistant
            ? 'Assistant'
            : part.role === 'system'
              ? 'System'
              : 'User',
          type: isAssistant ? 'llm_call' : 'event',
          status: 'success',
          clock,
          output: part.content,
        })
      );
      continue;
    }

    // tool_call: pair with the next ToolCallRecord (same order as adaptTranscript).
    const rec = toolCalls[toolIdx++];
    if (rec?.ts && rec.ts > clock) clock = rec.ts;
    const attrs: TraceSpanAttribute[] = (rec?.loadedSkills ?? []).map(
      (name) => ({
        key: 'skill',
        value: { stringValue: name },
      })
    );
    children.push(
      makeSpan({
        id: nextId('tool'),
        title: `Tool: ${part.name}`,
        type: 'tool_execution',
        status: part.error ? 'error' : 'success',
        clock,
        input: safeStringify(part.input),
        output:
          part.error ??
          (part.output !== undefined ? safeStringify(part.output) : undefined),
        attributes: attrs.length > 0 ? attrs : undefined,
      })
    );
  }

  // Checks that failed get their own event span so a failed run surfaces why.
  for (const check of checks) {
    if (check.passed) continue;
    children.push(
      makeSpan({
        id: nextId('check'),
        title: `Check failed: ${check.name}`,
        type: 'event',
        status: 'error',
        clock,
        output: check.notes ?? check.judgeNotes ?? '',
      })
    );
  }

  const rootStatus: TraceSpanStatus = passed ? 'success' : 'error';
  const root = makeSpan({
    id: `eval:${evalId}`,
    title: evalId,
    type: 'agent_invocation',
    status: rootStatus,
    clock,
    output: agentReport,
    children,
  });

  const spansCount = countSpans([root]);
  const agentDescription =
    experimentDisplay?.modelId ?? experimentDisplay?.agent ?? '';

  const traceRecord: TraceRecord = {
    id: evalId,
    name: evalId,
    spansCount,
    durationMs: 0, // ponytail: no per-span wall-clock recorded; upgrade if we ever log ts deltas
    agentDescription,
  };

  const badges: TraceBadge[] = [
    { label: passed ? 'Passed' : 'Failed', tone: passed ? 'success' : 'error' },
  ];
  if (available.length > 0) {
    badges.push({
      label: `${loaded.length}/${available.length} skills`,
      tone: loaded.length > 0 ? 'success' : 'neutral',
    });
  }
  if (attempts && attempts > 1) {
    badges.push({ label: `${attempts} attempts`, tone: 'warning' });
  }
  if (experimentDisplay?.modelId) {
    badges.push({ label: experimentDisplay.modelId, tone: 'neutral' });
  }

  return { traceRecord, spans: [root], badges };
}

// ── helpers ────────────────────────────────────────────────────────────────

interface MakeSpanInput {
  id: string;
  title: string;
  type: TraceSpan['type'];
  status: TraceSpanStatus;
  clock: number;
  input?: string;
  output?: string;
  attributes?: TraceSpanAttribute[];
  children?: TraceSpan[];
}

function makeSpan(input: MakeSpanInput): TraceSpan {
  const start = new Date(input.clock);
  return {
    id: input.id,
    title: input.title,
    startTime: start,
    endTime: start,
    duration: 0,
    type: input.type,
    status: input.status,
    raw: input.output ?? input.input ?? '',
    ...(input.input !== undefined ? { input: input.input } : {}),
    ...(input.output !== undefined ? { output: input.output } : {}),
    ...(input.attributes ? { attributes: input.attributes } : {}),
    ...(input.children ? { children: input.children } : {}),
  };
}

function countSpans(spans: TraceSpan[]): number {
  let n = 0;
  for (const s of spans) {
    n += 1;
    if (s.children) n += countSpans(s.children);
  }
  return n;
}

function safeStringify(value: unknown): string {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
