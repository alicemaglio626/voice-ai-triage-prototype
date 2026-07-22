import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

// The dashboard nav items that aren't part of the prototype. They exist so the
// shell feels like the real dash; each renders a "not in this prototype"
// placeholder instead of 404-ing. The two real prototype flows
// (/triage-prototype, /ops-review-prototype) have their own routes and win over
// this catch-all.
const PLACEHOLDER_ROUTES: { slug: string[]; label: string }[] = [
  { slug: ["calls", "explorer"], label: "Call explorer" },
  { slug: ["calls", "review"], label: "Ops Review" },
  { slug: ["batches"], label: "Batches" },
  { slug: ["test-call"], label: "Test calls" },
  { slug: ["use-cases"], label: "Use cases" },
  { slug: ["platform-implementations"], label: "Implementations" },
  { slug: ["classification-playground"], label: "Classification" },
  { slug: ["rnd", "analysis"], label: "Analysis" },
  { slug: ["rnd", "triage"], label: "Triage" },
  { slug: ["rnd", "work-items"], label: "Work items" },
  { slug: ["phone-management"], label: "Phone management" },
  { slug: ["users"], label: "Users" },
];

export function generateStaticParams() {
  return PLACEHOLDER_ROUTES.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export default async function PlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const match = PLACEHOLDER_ROUTES.find(
    (r) => r.slug.join("/") === slug.join("/"),
  );
  const label = match?.label ?? "Page";

  return (
    <div className="space-y-4">
      <PageHeader breadcrumbs={[{ label }]} title={label} />
      <EmptyState
        icon={FlaskConical}
        title="Not part of this prototype"
        description={`“${label}” is a real dashboard page — it isn't mocked in this prototype. The prototype covers the Triage and Ops Review flows.`}
      />
      <div className="flex justify-center gap-2">
        <Button asChild variant="outline">
          <Link href="/triage-prototype">Go to Triage prototype</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/ops-review-prototype">Go to Ops Review prototype</Link>
        </Button>
      </div>
    </div>
  );
}
