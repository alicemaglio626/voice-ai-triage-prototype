// Mock triage backlog for the prototype — real reviewer notes + call IDs pulled from
// the sample CSVs, spread across themes so the grouped view looks realistic.
// Stand-in for what the app would read from its own DB (the `call_review.notes`).

export interface TriageItem {
  call_id: string;
  note: string;
  created_date: string;
}

export const TRIAGE_MOCK: TriageItem[] = [
  // Premature exit (generic AI ended)
  { call_id: "21e2a2ee", note: "AI agent ended the call", created_date: "2026-07-02" },
  { call_id: "162209bb", note: "AI agent ended the call.", created_date: "2026-07-02" },
  { call_id: "9f179dc9", note: "AI ended the call", created_date: "2026-06-17" },
  { call_id: "871901b9", note: "AI agent ended the call", created_date: "2026-06-30" },

  // Provider refuses records request
  { call_id: "8663085a", note: "Site would not assist with medical records request. AI agent ended the call", created_date: "2026-07-07" },
  { call_id: "5ffb78a3", note: "Site refused to discuss medical records request.", created_date: "2026-07-07" },
  { call_id: "d38b28c4", note: "Site refused to discuss medical record request", created_date: "2026-07-01" },
  { call_id: "1b4dd882", note: "Site would not assist with medical records request. AI agent ended the call", created_date: "2026-07-02" },

  // Provider insists on a human
  { call_id: "35ed4d4a", note: "Site requested to speak with HUMAN about patient records due to HIPAA.", created_date: "2026-07-07" },
  { call_id: "ca1002d9", note: "Site requested to speak with HUMAN", created_date: "2026-07-01" },
  { call_id: "5eaf691d", note: "Site requested to speak with HUMAN", created_date: "2026-06-30" },

  // Verification
  { call_id: "f82e030d", note: "Member did not verify.", created_date: "2026-06-25" },
  { call_id: "d06903f3", note: "Address did not verify", created_date: "2026-07-08" },
  { call_id: "d1886079", note: "AI agent did not provide the reference ID, nor did it verify member or provider.", created_date: "2026-06-30" },
  { call_id: "ef2bd298", note: "Address verified. Ai Jessica did not wait for site to verify member.", created_date: "2026-07-02" },
  { call_id: "4029d294", note: "Wrong address.", created_date: "2026-07-02" },
  { call_id: "11556718", note: "Member did not verify.", created_date: "2026-06-22" },

  // Commitment date
  { call_id: "d3f2d0f2", note: "Provider could not commit. AI agent ended call.", created_date: "2026-07-08" },
  { call_id: "a030e905", note: "Provider could not commit. AI agent ended call.", created_date: "2026-06-16" },

  // Voicemail
  { call_id: "aa10c001", note: "AI agent did not leave a VM", created_date: "2026-07-03" },
  { call_id: "aa10c002", note: "The AI agent was directed to leave a voice message, but AI ended the call.", created_date: "2026-07-02" },
  { call_id: "aa10c003", note: "AI agent did not leave a VM", created_date: "2026-06-28" },
  { call_id: "aa10c004", note: "Voicemail not set up/Mailbox full", created_date: "2026-06-27" },

  // IVR / hold / prompts
  { call_id: "bb20d001", note: "IVR hung up", created_date: "2026-07-05" },
  { call_id: "bb20d002", note: "AI did not select the correct option given by the IVR. AI ended the call.", created_date: "2026-07-04" },
  { call_id: "bb20d003", note: "IVR hung up.", created_date: "2026-06-30" },
  { call_id: "bb20d004", note: "Identifying hold music", created_date: "2026-06-24" },
  { call_id: "bb20d005", note: "AI agent could not get past prompts.", created_date: "2026-06-22" },

  // Wrong dept / reroute / callback
  { call_id: "db6044c2", note: "Connected with site. Wrong dept. AI agent ended the call", created_date: "2026-06-30" },
  { call_id: "cc30e002", note: "Advised to call a different location/number", created_date: "2026-06-26" },
  { call_id: "cc30e003", note: "Call back required", created_date: "2026-06-20" },

  // Reach a live person / transfer
  { call_id: "dd40f001", note: "agent was not able to connect to a live rep", created_date: "2026-06-26" },
  { call_id: "dd40f002", note: "Site offered to transfer, AI did not take the transfer", created_date: "2026-06-19" },

  // Fax
  { call_id: "ee50a001", note: "Provider office says medical records are handled via fax", created_date: "2026-06-29" },
  { call_id: "ee50a002", note: "AI agent did not confirm the fax number.", created_date: "2026-06-21" },

  // Answering service
  { call_id: "8eaf0e09", note: "Doctor Amudi's answering service.", created_date: "2026-07-06" },
  { call_id: "17d95d98", note: "answering service couldn't verify information", created_date: "2026-06-26" },

  // No answer / closed / after-hours
  { call_id: "ff60b001", note: "No answer", created_date: "2026-07-07" },
  { call_id: "ff60b002", note: "Office closed", created_date: "2026-07-01" },
  { call_id: "ff60b003", note: "No answer", created_date: "2026-06-25" },

  // Bad / dead number
  { call_id: "11a0c001", note: "Number not in service", created_date: "2026-07-03" },
  { call_id: "11a0c002", note: "Bad number", created_date: "2026-06-24" },

  // Bot-to-bot
  { call_id: "22b0d001", note: "Ai to Ai. Did not reach live rep or get past ivr. AI Jessica ended the call.", created_date: "2026-07-07" },

  // System ended / dropped
  { call_id: "33c0e001", note: "Call ended by system", created_date: "2026-07-04" },
  { call_id: "33c0e002", note: "Call was dropped.", created_date: "2026-06-23" },

  // AI silence / no response
  { call_id: "44d0f001", note: "AI agent did not respond", created_date: "2026-07-05" },
  { call_id: "44d0f002", note: "Dead air", created_date: "2026-06-24" },

  // Payment (off-script bug)
  { call_id: "55e0a001", note: "AI Agent says unable to discuss payments but no payment was mentioned", created_date: "2026-07-07" },

  // No transcript
  { call_id: "66f0b001", note: "No transcript available", created_date: "2026-07-07" },
  { call_id: "66f0b002", note: "No transcript available", created_date: "2026-07-06" },

  // Identity & script integrity
  { call_id: "77a0c001", note: "Jessica skipped introduction", created_date: "2026-06-28" },
];
