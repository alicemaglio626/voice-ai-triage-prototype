// Mock detail data for the full-screen call view — call type (which script),
// a plausible transcript, and the "machine opinions" (prior tags) shown in
// production. Deterministic from the call_id/note so it's stable per call.

export const CALL_TYPES = [
  "Unscheduled",
  "Past Due Follow Up",
  "Scheduled",
] as const;
export type CallType = (typeof CALL_TYPES)[number];

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

// A deterministic, plausible 10-digit number per call — stands in for the phone
// number triage is actually keyed by. Stable so the list and detail agree.
export function phoneFor(id: string): string {
  const h = hash(id);
  const area = 200 + (h % 800);
  const mid = 100 + ((h >> 8) % 900);
  const last = (h >> 16) % 10000;
  return `${area}${mid}${String(last).padStart(4, "0")}`;
}

// What Ops Review captured for this call (the new lightweight capture). Null =
// not captured — the capture is new/optional, so not every escalated call has it.
export type YesNo = "Yes" | "No" | null;

// The specific AI failure modes Ops Review can tag (structured reasons).
export const AI_MISTAKE_REASONS = [
  "Repeated itself / looped",
  "Didn't understand",
  "Said the wrong thing at the wrong time",
  "Talked over staff",
  "Dead air / long silence",
  "Ended the call too early",
] as const;
export type AiMistakeReason = (typeof AI_MISTAKE_REASONS)[number];

export function opsCaptureFor(id: string): {
  aiMistake: AiMistakeReason | null;
  frustrated: YesNo;
} {
  const h = hash(id);
  const m = h % 5;
  const f = (h >> 4) % 5;
  return {
    aiMistake:
      m <= 1 ? null : AI_MISTAKE_REASONS[(h >> 8) % AI_MISTAKE_REASONS.length],
    frustrated: f === 0 ? null : f <= 2 ? "Yes" : "No",
  };
}

// Why the call landed in triage. Ops Escalation = a reviewer flagged it during
// Ops review. System Disagreement = the classifiers disagreed / the system
// couldn't confidently identify the outcome and kicked it up on its own.
export const TRIAGE_REASONS = ["Ops Escalation", "System Disagreement"] as const;
export type TriageReason = (typeof TRIAGE_REASONS)[number];

export function reasonFor(id: string): TriageReason {
  return hash(id) % 3 === 0 ? "System Disagreement" : "Ops Escalation";
}

export function callTypeFor(id: string): CallType {
  const n = hash(id) % 10;
  if (n <= 4) return "Unscheduled";
  if (n <= 8) return "Past Due Follow Up";
  return "Scheduled";
}

// Distinct pill per call type — a different palette from "who ended" (which uses
// red/amber) so the two columns read apart.
export function callTypeBadgeVariant(t: CallType) {
  switch (t) {
    case "Unscheduled":
      return "default" as const;
    case "Past Due Follow Up":
      return "secondary" as const;
    case "Scheduled":
      return "outline" as const;
  }
}

export interface Turn {
  speaker: "AGENT" | "HUMAN";
  time: string;
  text: string;
}

export interface Transcript {
  turns: Turn[];
  endedBy: string;
  endedAt: string;
}

// A plausible short transcript, lightly themed, ending in a way that matches
// the note. Mock — stands in for the real transcript the dashboard already has.
export function mockTranscript(
  note: string,
  theme: string,
  whoEnded: string,
): Transcript {
  const opener: Turn = {
    speaker: "AGENT",
    time: "10:14:02 AM",
    text: "Hi! I'm calling about a medical records request. Can you help me with that?",
  };
  const disclose: Turn = {
    speaker: "AGENT",
    time: "10:14:14 AM",
    text: "My name is Jessica, I'm an automated assistant from Datavant calling on behalf of the health plan. This call is being recorded.",
  };

  let middle: Turn[];
  if (theme.startsWith("Provider refuses")) {
    middle = [
      { speaker: "HUMAN", time: "10:14:09 AM", text: "We don't handle that over the phone." },
      { speaker: "AGENT", time: "10:14:12 AM", text: "Understood. Thank you for your time." },
    ];
  } else if (theme.startsWith("Provider insists")) {
    middle = [
      { speaker: "HUMAN", time: "10:14:09 AM", text: "I can't talk to an automated system about patient records — that's a HIPAA thing." },
      { speaker: "AGENT", time: "10:14:13 AM", text: "Understood. Thank you for your time." },
    ];
  } else if (theme === "Verification") {
    middle = [
      { speaker: "HUMAN", time: "10:14:09 AM", text: "Sure, what do you need?" },
      disclose,
      { speaker: "AGENT", time: "10:14:26 AM", text: "Can you confirm you have records for the patient, date of birth March 4th 1961?" },
      { speaker: "HUMAN", time: "10:14:31 AM", text: "Let me check… one sec." },
      { speaker: "AGENT", time: "10:14:34 AM", text: "I'm sorry, I wasn't able to verify the member." },
    ];
  } else if (theme === "Voicemail") {
    middle = [
      { speaker: "HUMAN", time: "10:14:06 AM", text: "You've reached the records department, please leave a message after the tone." },
    ];
  } else {
    middle = [
      { speaker: "HUMAN", time: "10:14:09 AM", text: "Okay, what is this regarding?" },
      disclose,
      { speaker: "HUMAN", time: "10:14:22 AM", text: "Hold on…" },
    ];
  }

  const closer: Turn = {
    speaker: "AGENT",
    time: "10:14:40 AM",
    text: `[Reviewer note: ${note}]`,
  };

  return {
    turns: [opener, ...middle, closer],
    endedBy: whoEnded === "Unknown" ? "agent" : whoEnded.toLowerCase(),
    endedAt: "10:14:41 AM",
  };
}

export interface MachineOpinions {
  judgeOutcome: string;
  judgeConfidence: "high" | "low" | "unavailable";
  structuredOutcome: string;
  // The auto result actually delivered for the call (the one shown on the call
  // record). Mirrors prod's "Delivered classification" — free text, unchanged
  // by triage unless someone overrides it.
  delivered: string;
}

export function mockMachineOpinions(theme: string): MachineOpinions {
  if (theme === "Verification")
    return { judgeOutcome: "Verification Failed", judgeConfidence: "low", structuredOutcome: "Verification Failed", delivered: "Member Not Verified" };
  if (theme.startsWith("Provider refuses") || theme.startsWith("Provider insists"))
    return { judgeOutcome: "Human Hangup", judgeConfidence: "low", structuredOutcome: "Human Hangup", delivered: "Human Hung Up" };
  if (theme === "Voicemail")
    return { judgeOutcome: "Left Voicemail", judgeConfidence: "high", structuredOutcome: "No Answer", delivered: "Left Voicemail" };
  if (theme.startsWith("AI ends"))
    return { judgeOutcome: "Human Hangup", judgeConfidence: "low", structuredOutcome: "Scheduled", delivered: "Human Hung Up" };
  return { judgeOutcome: "Scheduled", judgeConfidence: "low", structuredOutcome: "Verification Failed", delivered: "Scheduled" };
}
