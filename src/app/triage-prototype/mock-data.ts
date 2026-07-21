// Synthetic triage backlog for the prototype. Notes and call IDs are fabricated
// stand-ins that mirror the shape of real reviewer notes (same themes/keywords)
// so the grouped view looks realistic — no real call IDs or internal notes.
// Stand-in for what the app would read from its own DB (the `call_review.notes`).

export interface TriageItem {
  call_id: string;
  note: string;
  created_date: string;
}

export const TRIAGE_MOCK: TriageItem[] = [
  // Premature exit (generic AI ended)
  { call_id: "3a71f0c4", note: "Assistant ended the call early", created_date: "2026-07-02" },
  { call_id: "9c02b7e1", note: "AI ended the call before wrapping up.", created_date: "2026-07-02" },
  { call_id: "5f8d1a90", note: "AI ended the call", created_date: "2026-06-17" },
  { call_id: "1e64c33b", note: "Assistant ended the call prematurely", created_date: "2026-06-30" },

  // Provider refuses records request
  { call_id: "7b90a2d5", note: "Office would not assist with the records request. AI ended the call", created_date: "2026-07-07" },
  { call_id: "2d4e8f16", note: "Office refused to discuss the records request.", created_date: "2026-07-07" },
  { call_id: "c8137be0", note: "Site refused to discuss the record request", created_date: "2026-07-01" },
  { call_id: "6a2205cf", note: "Office would not assist with the records request. AI ended the call", created_date: "2026-07-02" },

  // Provider insists on a human
  { call_id: "e34b91a7", note: "Site requested to speak with human for privacy reasons.", created_date: "2026-07-07" },
  { call_id: "4fd0c682", note: "Site requested to speak with human", created_date: "2026-07-01" },
  { call_id: "0b7e5d31", note: "Site requested to speak with human", created_date: "2026-06-30" },

  // Verification
  { call_id: "a9126f4d", note: "Member did not verify.", created_date: "2026-06-25" },
  { call_id: "d5c803ae", note: "Address did not verify", created_date: "2026-07-08" },
  { call_id: "82f4171c", note: "Assistant did not provide the reference ID, and did not verify member or provider.", created_date: "2026-06-30" },
  { call_id: "3ee6b508", note: "Address verified. Assistant did not wait for the site to verify the member.", created_date: "2026-07-02" },
  { call_id: "70a1d9c6", note: "Wrong address.", created_date: "2026-07-02" },
  { call_id: "c1553270", note: "Member did not verify.", created_date: "2026-06-22" },

  // Commitment date
  { call_id: "9d0f22b3", note: "Provider could not commit. AI ended the call.", created_date: "2026-07-08" },
  { call_id: "5a03e918", note: "Provider could not commit. AI ended the call.", created_date: "2026-06-16" },

  // Voicemail
  { call_id: "b410c0a1", note: "Assistant did not leave a voicemail", created_date: "2026-07-03" },
  { call_id: "b410c0a2", note: "Assistant was meant to leave a voice message, but AI ended the call.", created_date: "2026-07-02" },
  { call_id: "b410c0a3", note: "Assistant did not leave a voicemail", created_date: "2026-06-28" },
  { call_id: "b410c0a4", note: "Voicemail not set up / mailbox full", created_date: "2026-06-27" },

  // IVR / hold / prompts
  { call_id: "c520d0b1", note: "IVR hung up", created_date: "2026-07-05" },
  { call_id: "c520d0b2", note: "Assistant did not select the correct option given by the IVR. AI ended the call.", created_date: "2026-07-04" },
  { call_id: "c520d0b3", note: "IVR hung up.", created_date: "2026-06-30" },
  { call_id: "c520d0b4", note: "Identifying hold music", created_date: "2026-06-24" },
  { call_id: "c520d0b5", note: "Assistant could not get past prompts.", created_date: "2026-06-22" },

  // Wrong dept / reroute / callback
  { call_id: "d6a044c2", note: "Connected with the site. Wrong dept. AI ended the call", created_date: "2026-06-30" },
  { call_id: "d630e002", note: "Advised to call a different location/number", created_date: "2026-06-26" },
  { call_id: "d630e003", note: "Call back required", created_date: "2026-06-20" },

  // Reach a live person / transfer
  { call_id: "e740f001", note: "Assistant was not able to connect to a live rep", created_date: "2026-06-26" },
  { call_id: "e740f002", note: "Site offered to transfer, assistant did not take the transfer", created_date: "2026-06-19" },

  // Fax
  { call_id: "f850a001", note: "Provider office says records are handled via fax", created_date: "2026-06-29" },
  { call_id: "f850a002", note: "Assistant did not confirm the fax number.", created_date: "2026-06-21" },

  // Answering service
  { call_id: "1a6f0e09", note: "Reached an answering service.", created_date: "2026-07-06" },
  { call_id: "27d95d98", note: "Answering service couldn't verify information", created_date: "2026-06-26" },

  // No answer / closed / after-hours
  { call_id: "0f60b001", note: "No answer", created_date: "2026-07-07" },
  { call_id: "0f60b002", note: "Office closed", created_date: "2026-07-01" },
  { call_id: "0f60b003", note: "No answer", created_date: "2026-06-25" },

  // Bad / dead number
  { call_id: "21a0c001", note: "Number not in service", created_date: "2026-07-03" },
  { call_id: "21a0c002", note: "Bad number", created_date: "2026-06-24" },

  // Bot-to-bot
  { call_id: "32b0d001", note: "AI to AI. Did not reach live rep or get past IVR. Assistant ended the call.", created_date: "2026-07-07" },

  // System ended / dropped
  { call_id: "43c0e001", note: "Call ended by system", created_date: "2026-07-04" },
  { call_id: "43c0e002", note: "Call was dropped.", created_date: "2026-06-23" },

  // AI silence / no response
  { call_id: "54d0f001", note: "Assistant did not respond", created_date: "2026-07-05" },
  { call_id: "54d0f002", note: "Dead air", created_date: "2026-06-24" },

  // Payment (off-script bug)
  { call_id: "65e0a001", note: "Assistant says unable to discuss payments but no payment was mentioned", created_date: "2026-07-07" },

  // No transcript
  { call_id: "76f0b001", note: "No transcript available", created_date: "2026-07-07" },
  { call_id: "76f0b002", note: "No transcript available", created_date: "2026-07-06" },

  // Identity & script integrity
  { call_id: "87a0c001", note: "Assistant skipped introduction", created_date: "2026-06-28" },
];
