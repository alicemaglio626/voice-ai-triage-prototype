import { DISAGREEMENT_MOCK } from "../../disagreement-mock";
import DetailView from "./detail-view";

// Static export needs the full set of disagreement pages known at build time.
export function generateStaticParams() {
  return DISAGREEMENT_MOCK.map((r) => ({ callId: r.call_id }));
}

export default function Page() {
  return <DetailView />;
}
