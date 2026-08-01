import { describe, expect, it } from 'vitest';
import { evalResultToTraceSpans } from './trace-viewer.js';
import type { ToolCallRecord, TranscriptPart } from './index.js';
import type { SkillResult } from './eval-metadata.js';
import type { CheckResult } from './eval-metadata.js';

const transcript: TranscriptPart[] = [
  {
    type: 'message',
    role: 'user',
    content: 'Why is my RLS policy blocking reads?',
  },
  { type: 'message', role: 'assistant', content: 'Let me load the RLS skill.' },
  {
    type: 'tool_call',
    name: 'load_skill',
    input: { skill_name: 'supabase-rls' },
    output: { instructions: '...' },
  },
  {
    type: 'tool_call',
    name: 'sql',
    input: { query: 'select * from policies;' },
    error: 'permission denied',
  },
];

const toolCalls: ToolCallRecord[] = [
  {
    endpoint: 'load_skill',
    body: { skill_name: 'supabase-rls' },
    loadedSkills: ['supabase-rls'],
    result: { instructions: '...' },
    ts: 0,
  },
  {
    endpoint: 'sql',
    body: { query: 'select * from policies;' },
    error: 'permission denied',
    ts: 0,
  },
];

const skills: SkillResult = {
  available: ['supabase-rls', 'supabase-migrations', 'supabase-cli'],
  loaded: ['supabase-rls'],
};

const checks: CheckResult[] = [
  { name: 'rls policy correct', passed: false, notes: 'missed USING clause' },
];

describe('evalResultToTraceSpans', () => {
  const data = evalResultToTraceSpans({
    evalId: 'investigate-rls-01',
    passed: false,
    transcript,
    toolCalls,
    agentReport: 'The policy is missing a USING clause.',
    skills,
    checks,
    experimentDisplay: { agent: 'ai-sdk', modelId: 'claude-sonnet-5' },
    attempts: 2,
  });

  it('returns one root agent_invocation span wrapping all children', () => {
    expect(data.spans).toHaveLength(1);
    const root = data.spans[0]!;
    expect(root.type).toBe('agent_invocation');
    expect(root.id).toBe('eval:investigate-rls-01');
    expect(root.status).toBe('error'); // passed=false
    expect(root.output).toBe('The policy is missing a USING clause.');
    // user + assistant + 2 tool calls + 1 failed check
    expect(root.children).toHaveLength(5);
  });

  it('maps assistant messages to llm_call and user/system to event', () => {
    const children = data.spans[0]!.children!;
    expect(children[0]!.type).toBe('event'); // user
    expect(children[0]!.title).toBe('User');
    expect(children[1]!.type).toBe('llm_call'); // assistant
    expect(children[1]!.title).toBe('Assistant');
  });

  it('pairs tool_call parts with ToolCallRecords by order and copies loadedSkills as attributes', () => {
    const children = data.spans[0]!.children!;
    const loadSkill = children[2]!;
    expect(loadSkill.type).toBe('tool_execution');
    expect(loadSkill.title).toBe('Tool: load_skill');
    expect(loadSkill.status).toBe('success');
    expect(loadSkill.attributes).toEqual([
      { key: 'skill', value: { stringValue: 'supabase-rls' } },
    ]);
  });

  it('marks a tool_call with an error as error status and surfaces the error as output', () => {
    const sql = data.spans[0]!.children![3]!;
    expect(sql.type).toBe('tool_execution');
    expect(sql.status).toBe('error');
    expect(sql.output).toBe('permission denied');
  });

  it('adds an error event span per failed check', () => {
    const checkSpan = data.spans[0]!.children![4]!;
    expect(checkSpan.type).toBe('event');
    expect(checkSpan.status).toBe('error');
    expect(checkSpan.title).toContain('rls policy correct');
  });

  it('records span count and builds badges', () => {
    expect(data.traceRecord.id).toBe('investigate-rls-01');
    expect(data.traceRecord.spansCount).toBe(6); // root + 5 children
    expect(data.traceRecord.agentDescription).toBe('claude-sonnet-5');
    const labels = data.badges.map((b) => b.label);
    expect(labels).toContain('Failed');
    expect(labels).toContain('1/3 skills');
    expect(labels).toContain('2 attempts');
    expect(labels).toContain('claude-sonnet-5');
  });

  it('passes status when the run passed and no failed-check spans are added', () => {
    const ok = evalResultToTraceSpans({
      evalId: 'e2',
      passed: true,
      transcript: [{ type: 'message', role: 'assistant', content: 'done' }],
      toolCalls: [],
      agentReport: '',
      skills: { available: ['s'], loaded: ['s'] },
      checks: [{ name: 'c', passed: true }],
    });
    expect(ok.spans[0]!.status).toBe('success');
    expect(ok.spans[0]!.children).toHaveLength(1); // assistant only, no failed-check span
    expect(ok.badges[0]).toEqual({ label: 'Passed', tone: 'success' });
  });
});
