import { OPS_QUEUE } from "../queue-mock";
import DetailView from "./detail-view";

// Static export needs the full set of call pages known at build time.
export function generateStaticParams() {
  return OPS_QUEUE.map((r) => ({ callId: r.id }));
}

export default function Page() {
  return <DetailView />;
}
