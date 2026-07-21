import { TRIAGE_MOCK } from "../mock-data";
import DetailView from "./detail-view";

// Static export needs the full set of call pages known at build time.
export function generateStaticParams() {
  return TRIAGE_MOCK.map((i) => ({ callId: i.call_id }));
}

export default function Page() {
  return <DetailView />;
}
