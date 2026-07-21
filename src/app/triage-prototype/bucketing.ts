// Theme bucketing — the SAME keyword rules used in the Snowflake backlog analysis,
// ported to run in the app. This is plain string-matching, NOT an LLM: it derives a
// theme + lever from the reviewer note the dashboard already has. No AI, no Snowflake.
//
// Order matters: specific causes are matched before the generic "AI ended the call",
// so a note like "Site would not assist... AI agent ended the call" lands under
// Refusal (the cause), not Premature exit (the surface fact).

export type Lever =
  | "Call design"
  | "Capability"
  | "Environmental"
  | "Mixed"
  | "Data quality";

export interface ThemeTag {
  theme: string;
  lever: Lever;
}

export function deriveTheme(noteRaw: string): ThemeTag {
  const n = noteRaw.toLowerCase();
  const has = (re: RegExp) => re.test(n);

  if (has(/no transcript|no audio|transcript\/audio is unavailable|no call to review|no data/))
    return { theme: "Exclude — no transcript / data", lever: "Data quality" };

  if (has(/health plan|skipped intro|restart|assumed she was|hallucinat|works for the/))
    return { theme: "Identity & script integrity", lever: "Call design" };

  if (has(/payment/))
    return { theme: "Payment", lever: "Call design" };

  if (has(/answering service/))
    return { theme: "Answering service", lever: "Capability" };

  if (has(/ai to ai|bot to bot/))
    return { theme: "Bot-to-bot", lever: "Environmental" };

  if (has(/fax/))
    return { theme: "Fax", lever: "Capability" };

  if (has(/voice message|voicemail|\bvm\b|mailbox|leave a message/))
    return { theme: "Voicemail", lever: "Capability" };

  if (has(/ivr|hold music|on hold|hold time|select an option|select the correct option|get past prompt|could not get past/))
    return { theme: "IVR / hold / prompts", lever: "Capability" };

  if (has(/speak with human|speak to a human|requested to speak with human|wants to speak with a human/))
    return { theme: "Provider insists on a human", lever: "Capability" };

  if (has(/not able to connect|could not connect|live rep|transfer|reroute/))
    return { theme: "Reach a live person / transfer", lever: "Capability" };

  if (has(/wrong dept|different location|different number|wrong number|wrong location|not a medical facility|call ?back/))
    return { theme: "Wrong dept / reroute / callback", lever: "Capability" };

  if (has(/verify|verified|identifier|wrong address|address did not/))
    return { theme: "Verification", lever: "Mixed" };

  if (has(/commit/))
    return { theme: "Commitment date", lever: "Call design" };

  if (has(/refuse|would not assist|not assist|would not discuss|refused to discuss/))
    return { theme: "Provider refuses records request", lever: "Mixed" };

  if (has(/not in service|bad number|unassigned|disconnect/))
    return { theme: "Bad / dead number", lever: "Environmental" };

  if (has(/no answer|office closed|closed|after hours|just rings/))
    return { theme: "No answer / closed / after-hours", lever: "Environmental" };

  if (has(/did not respond|no response|gave up|dead air|never responded/))
    return { theme: "AI silence / no response", lever: "Capability" };

  if (has(/ended by system|call was dropped|dropped|ended by agent/))
    return { theme: "System ended / call dropped", lever: "Capability" };

  if (has(/ai agent ended|ai ended|jessica ended|ended the call|did not reach live rep/))
    return { theme: "AI ends the call early (premature exit)", lever: "Call design" };

  return { theme: "Uncategorized", lever: "Mixed" };
}

export type WhoEnded = "AI" | "Staff" | "System" | "Unknown";

// Rough heuristic for demo — the real "who ended the call?" would be a captured field.
export function deriveWhoEnded(noteRaw: string): WhoEnded {
  const n = noteRaw.toLowerCase();
  if (/ended by system|dropped|call was dropped/.test(n)) return "System";
  if (/ai (agent |jessica )?(ended|end)|ai ended|ended the call/.test(n)) return "AI";
  if (/refuse|would not|hung up|requested to speak|declined/.test(n)) return "Staff";
  return "Unknown";
}

export function leverBadgeVariant(lever: Lever) {
  switch (lever) {
    case "Call design":
      return "default" as const; // brand primary — our lever
    case "Capability":
      return "secondary" as const;
    case "Mixed":
      return "warning" as const;
    case "Environmental":
      return "outline" as const;
    case "Data quality":
      return "ghost" as const;
  }
}

export function whoEndedBadgeVariant(who: WhoEnded) {
  switch (who) {
    case "AI":
      return "destructive" as const;
    case "Staff":
      return "secondary" as const;
    case "System":
      return "warning" as const;
    case "Unknown":
      return "secondary" as const;
  }
}

export const NON_ACTIONABLE_LEVERS: ReadonlySet<Lever> = new Set([
  "Environmental",
  "Data quality",
]);

// --- Theme → suggested work item -------------------------------------------
// The theme is NOT a work item — but it SEEDS one. This maps each theme to the
// closest EXISTING work item (to link) and a pre-filled NEW draft (type + title),
// so the "Add work item" step is one click instead of a manual hunt. Human edits.

export type WorkItemType =
  | "Bug"
  | "New capability"
  | "Vendor failure"
  | "Not actionable";

export interface WorkItemSuggestion {
  existing: { title: string; type: WorkItemType } | null;
  draftType: WorkItemType;
  draftTitle: string;
}

const THEME_WORK_ITEM: Record<string, WorkItemSuggestion> = {
  "AI ends the call early (premature exit)": {
    existing: { title: "Jessica gave up prematurely", type: "Bug" },
    draftType: "Bug",
    draftTitle: "AI ended a call it shouldn't have",
  },
  "Provider refuses records request": {
    existing: { title: "Push the provider to transfer to someone who can help", type: "New capability" },
    draftType: "New capability",
    draftTitle: "Attempt a transfer before ending on a records refusal",
  },
  "Provider insists on a human": {
    existing: { title: "Speak to a real person", type: "New capability" },
    draftType: "New capability",
    draftTitle: "Handle staff who demand a human (privacy/HIPAA)",
  },
  Verification: {
    existing: { title: "Member not verified", type: "New capability" },
    draftType: "Bug",
    draftTitle: "AI mishandled verification (didn't wait / no reference ID)",
  },
  Voicemail: {
    existing: { title: "Did not handle/leave voicemail", type: "Bug" },
    draftType: "Bug",
    draftTitle: "AI didn't leave a voicemail when directed to",
  },
  "IVR / hold / prompts": {
    existing: { title: "IVR Navigation issues", type: "Bug" },
    draftType: "Bug",
    draftTitle: "AI couldn't navigate the IVR",
  },
  Fax: {
    existing: { title: 'Unable to recognise "fax"', type: "Bug" },
    draftType: "Bug",
    draftTitle: "AI mishandled a fax delivery request",
  },
  "Reach a live person / transfer": {
    existing: { title: "Speak to a real person", type: "New capability" },
    draftType: "New capability",
    draftTitle: "Handle reaching / asking for a live rep",
  },
  "Commitment date": {
    existing: { title: "Commitment date defaulted without confirmation", type: "Bug" },
    draftType: "Bug",
    draftTitle: "Commitment-date handling",
  },
  "Answering service": {
    existing: null,
    draftType: "New capability",
    draftTitle: "Recognise and handle a third-party answering service",
  },
  "Wrong dept / reroute / callback": {
    existing: { title: "Handle reroute scenarios", type: "New capability" },
    draftType: "New capability",
    draftTitle: "Handle wrong-dept / reroute / callback",
  },
  "Bad / dead number": {
    existing: { title: "Unassigned number / dead number", type: "New capability" },
    draftType: "Not actionable",
    draftTitle: "Bad / dead number",
  },
  "No answer / closed / after-hours": {
    existing: { title: "Office closed", type: "Not actionable" },
    draftType: "Not actionable",
    draftTitle: "No answer / office closed",
  },
  "Bot-to-bot": {
    existing: { title: "Bot to bot interactions", type: "Bug" },
    draftType: "Bug",
    draftTitle: "Bot-to-bot interaction",
  },
  "System ended / call dropped": {
    existing: null,
    draftType: "Vendor failure",
    draftTitle: "Call dropped / system-ended",
  },
  "AI silence / no response": {
    existing: null,
    draftType: "Vendor failure",
    draftTitle: "Dead air / AI did not respond",
  },
  Payment: {
    existing: { title: "AI made an inappropriate mention of payments", type: "Bug" },
    draftType: "Bug",
    draftTitle: "Off-script 'can't discuss payments' line",
  },
  "Identity & script integrity": {
    existing: { title: "Jessica skipped introduction", type: "Bug" },
    draftType: "Bug",
    draftTitle: "Opener / identity issue",
  },
  "Exclude — no transcript / data": {
    existing: { title: "Missing transcript", type: "Bug" },
    draftType: "Not actionable",
    draftTitle: "Missing transcript / data",
  },
};

export function suggestWorkItem(theme: string): WorkItemSuggestion {
  return (
    THEME_WORK_ITEM[theme] ?? {
      existing: null,
      draftType: "Bug",
      draftTitle: "New work item",
    }
  );
}

export function workItemTypeBadgeVariant(type: WorkItemType) {
  switch (type) {
    case "Bug":
      return "destructive" as const;
    case "New capability":
      return "default" as const;
    case "Vendor failure":
      return "warning" as const;
    case "Not actionable":
      return "outline" as const;
  }
}
