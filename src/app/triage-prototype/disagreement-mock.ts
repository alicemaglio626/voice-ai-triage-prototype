// Mock data for the Disagreements tab — resolved calls where the judge and
// structured classifiers disagreed, or the human diverged from both. Derived
// deterministically from the shared triage sample so the list, the row, and the
// disagreement detail all agree. Stand-in for prod's divergence feed.

import { TRIAGE_MOCK } from "./mock-data";
import { deriveTheme } from "./bucketing";
import {
  callTypeFor,
  phoneFor,
  mockMachineOpinions,
  type CallType,
} from "./detail-mock";

export interface DisagreementRow {
  call_id: string;
  phone: string;
  useCase: CallType;
  judge: string;
  judgeConfidence: "high" | "low" | "unavailable";
  structured: string;
  humanOutcome: string;
  resolvedDate: string;
  // The human resolution overruled BOTH machines (matches neither).
  humanOverruledBoth: boolean;
  // Same outcome, differing data fields (prod's DATA_MISMATCH narrowing).
  dataMismatch: boolean;
}

// All calls where the two classifiers landed on different outcomes — the
// disagreement set. Built once; deterministic per call_id.
export const DISAGREEMENT_MOCK: DisagreementRow[] = TRIAGE_MOCK.filter((it) => {
  const o = mockMachineOpinions(deriveTheme(it.note).theme);
  return o.judgeOutcome !== o.structuredOutcome;
}).map((it, i) => {
  const o = mockMachineOpinions(deriveTheme(it.note).theme);
  return {
    call_id: it.call_id,
    phone: phoneFor(it.call_id),
    useCase: callTypeFor(it.call_id),
    judge: o.judgeOutcome,
    judgeConfidence: o.judgeConfidence,
    structured: o.structuredOutcome,
    humanOutcome: o.delivered,
    resolvedDate: it.created_date,
    humanOverruledBoth:
      o.delivered !== o.judgeOutcome && o.delivered !== o.structuredOutcome,
    // A deterministic ~1-in-3 slice stands in for same-outcome/differing-data.
    dataMismatch: i % 3 === 0,
  };
});

export function disagreementFor(callId: string): DisagreementRow | undefined {
  return DISAGREEMENT_MOCK.find((r) => r.call_id === callId);
}
