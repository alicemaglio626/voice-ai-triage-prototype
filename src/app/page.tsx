import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, ArrowRight } from "lucide-react";

const PROTOTYPES = [
  {
    href: "/triage-prototype",
    title: "Triage",
    desc: "The triage queue with a Disagreements tab — filter by the fields captured in Ops review, open a call, file work items, or review a classifier disagreement.",
  },
  {
    href: "/ops-review-prototype",
    title: "Ops review",
    desc: "The reviewer's per-call screen — listen to the recording, read the transcript blind, and record what happened on the call.",
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Voice AI — review & triage</h1>
        <Badge variant="warning" className="gap-1">
          <FlaskConical className="h-3 w-3" />
          Prototype
        </Badge>
      </div>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Clickable prototype — all data is mocked. Pick a flow to explore.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROTOTYPES.map((p) => (
          <Link key={p.href} href={p.href}>
            <Card className="h-full transition-colors hover:border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {p.title}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
