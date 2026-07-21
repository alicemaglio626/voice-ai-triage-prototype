// Mock QA/ops review queue — stands in for what the app reads from its own DB.
// Mirrors the prod QA-review list (web/src/app/calls/qa/page.tsx): a call per row
// with phone, batch date, use case (call type), and a "Waiting" age.

export const CALL_TYPES = [
  "Unscheduled",
  "Past Due Follow Up",
  "Scheduled",
] as const;
export type CallType = (typeof CALL_TYPES)[number];

export interface QueueRow {
  id: string;
  phone: string;
  callType: CallType;
  batchDate: string; // display string, e.g. "Jun 24"
  waiting: string; // display string, e.g. "Waiting 14d"
  callPlaced: string; // display string for the detail info bar
}

export const OPS_QUEUE: QueueRow[] = [
  { id: "2036948402", phone: "2036948402", callType: "Scheduled", batchDate: "Jun 23", waiting: "Waiting 15d", callPlaced: "Jun 23, 2026, 9:12:04 AM CDT" },
  { id: "3048150050", phone: "3048150050", callType: "Scheduled", batchDate: "Jun 23", waiting: "Waiting 15d", callPlaced: "Jun 23, 2026, 10:41:22 AM CDT" },
  { id: "8634651880", phone: "8634651880", callType: "Past Due Follow Up", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 8:05:51 AM CDT" },
  { id: "5185127681", phone: "5185127681", callType: "Unscheduled", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 11:03:08 AM CDT" },
  { id: "5167921652", phone: "5167921652", callType: "Unscheduled", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 12:01:05 PM CDT" },
  { id: "3054032921", phone: "3054032921", callType: "Unscheduled", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 1:22:47 PM CDT" },
  { id: "9544559404", phone: "9544559404", callType: "Unscheduled", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 2:18:33 PM CDT" },
  { id: "9143526116", phone: "9143526116", callType: "Unscheduled", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 3:44:10 PM CDT" },
  { id: "7187097583", phone: "7187097583", callType: "Past Due Follow Up", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 9:31:59 AM CDT" },
  { id: "2124206002", phone: "2124206002", callType: "Past Due Follow Up", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 10:06:34 AM CDT" },
  { id: "5708365305", phone: "5708365305", callType: "Past Due Follow Up", batchDate: "Jun 24", waiting: "Waiting 14d", callPlaced: "Jun 24, 2026, 4:15:20 PM CDT" },
  { id: "6512543456", phone: "6512543456", callType: "Unscheduled", batchDate: "Jun 25", waiting: "Waiting 13d", callPlaced: "Jun 25, 2026, 10:05:32 AM CDT" },
  { id: "3527462200", phone: "3527462200", callType: "Unscheduled", batchDate: "Jun 25", waiting: "Waiting 13d", callPlaced: "Jun 25, 2026, 11:47:08 AM CDT" },
  { id: "8553981633", phone: "8553981633", callType: "Past Due Follow Up", batchDate: "Jun 26", waiting: "Waiting 12d", callPlaced: "Jun 26, 2026, 12:10:51 PM CDT" },
];

export function queueRowFor(id: string): QueueRow | undefined {
  return OPS_QUEUE.find((r) => r.id === id);
}
