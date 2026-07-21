"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { CopyIdButton } from "@/components/shared/copy-id-button";
import { EmptyState } from "@/components/shared/empty-state";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TRIAGE_MOCK } from "../../mock-data";
import {
  deriveTheme,
  deriveWhoEnded,
  workItemTypeBadgeVariant,
} from "../../bucketing";
import { mockTranscript, mockMachineOpinions } from "../../detail-mock";
import { disagreementFor } from "../../disagreement-mock";
import { AddWorkItemDialog, type LinkedWorkItem } from "../../add-work-item-dialog";

const LIST = "/triage-prototype?tab=disagreements";

export default function DisagreementDetailPage() {
  const params = useParams<{ callId: string }>();
  const router = useRouter();
  const item = TRIAGE_MOCK.find((i) => i.call_id === params.callId);
  const row = disagreementFor(params.callId);

  const [workItems, setWorkItems] = useState<LinkedWorkItem[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const addItems = (items: LinkedWorkItem[]) =>
    setWorkItems((prev) => {
      const have = new Set(prev.map((w) => w.title));
      return [...prev, ...items.filter((w) => !have.has(w.title))];
    });
  const removeItem = (t: string) =>
    setWorkItems((prev) => prev.filter((w) => w.title !== t));

  if (!item || !row) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Disagreement not found"
        description="This call isn't in the prototype disagreement sample."
        action={{ label: "Back to Disagreements", href: LIST }}
      />
    );
  }

  const { theme } = deriveTheme(item.note);
  const whoEnded = deriveWhoEnded(item.note);
  const transcript = mockTranscript(item.note, theme, whoEnded);
  const opinions = mockMachineOpinions(theme);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(LIST)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Review disagreement"
          breadcrumbs={[
            { label: "Triage (prototype)", href: "/triage-prototype" },
            { label: "Disagreements", href: LIST },
            { label: "Review disagreement" },
          ]}
        />
      </div>

      <div className="-mt-3 flex items-center gap-1 pl-14 text-xs text-muted-foreground">
        <span className="font-mono">{row.phone}</span>
        <CopyIdButton value={row.phone} label="phone number" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* LEFT — call data (blind) */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Call data</CardTitle>
              <p className="text-sm text-muted-foreground">
                Judge the call from the data alone — no machine guess is shown.
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-3 rounded-md border bg-muted/30 p-3">
                <Volume2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <audio controls preload="metadata" className="h-8 w-full">
                  <source src="/prototype-recording.mp3" type="audio/mpeg" />
                </audio>
              </div>
              <div className="space-y-2">
                {transcript.turns.map((t, i) => {
                  const isAgent = t.speaker === "AGENT";
                  return (
                    <div
                      key={i}
                      className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 ${
                          isAgent
                            ? "rounded-2xl rounded-bl-md border bg-card"
                            : "rounded-2xl rounded-br-md bg-muted"
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {t.speaker}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {t.time}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{t.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-center border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  Call ended by {transcript.endedBy} at {transcript.endedAt}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — machine opinions + triage affordances */}
        <div className="flex flex-col gap-4">
          {/* Machine opinions — the disagreement itself (non-blind) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Machine opinions</CardTitle>
              <p className="text-sm text-muted-foreground">
                The judge and structured classifiers for this run, shown against
                the human resolution. Non-blind by design — for triage, not
                review.
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 rounded-md border border-datavant-teal/40 bg-datavant-teal/5 p-2.5">
                <span className="text-sm text-muted-foreground">
                  Human outcome
                </span>
                <Badge className="ml-auto">{row.humanOutcome}</Badge>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-2.5">
                <span className="text-sm text-muted-foreground">Judge</span>
                <Badge className="ml-auto">{row.judge}</Badge>
                <Badge variant="outline" className="capitalize">
                  {row.judgeConfidence}
                </Badge>
              </div>
              <div className="flex items-center gap-2 rounded-md border p-2.5">
                <span className="text-sm text-muted-foreground">Structured</span>
                <Badge className="ml-auto">{row.structured}</Badge>
              </div>
              <Button
                variant="outline"
                className="w-full justify-center gap-1 font-normal"
                onClick={() => setShowDetails((s) => !s)}
              >
                {showDetails ? "Hide details" : "Show details"}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    showDetails && "rotate-180",
                  )}
                />
              </Button>
              {showDetails && (
                <div className="space-y-1.5 rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Delivered outcome</span>
                    <span className="font-medium text-foreground">
                      {opinions.delivered}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Judge confidence</span>
                    <span className="font-medium capitalize text-foreground">
                      {row.judgeConfidence}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classifiers agree?</span>
                    <span className="font-medium text-foreground">No</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work items — same affordance as the triage detail */}
          <Card className="ring-2 ring-[#7c8cef]/60">
            <CardHeader>
              <CardTitle className="text-base">Work items</CardTitle>
              <p className="text-sm text-muted-foreground">
                Attach the work item(s) this call surfaced, then resolve.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {workItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-md border border-dashed p-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    No work items linked yet.
                  </p>
                  <AddWorkItemDialog
                    theme={theme}
                    note={item.note}
                    onAdd={addItems}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {workItems.map((w) => (
                    <div
                      key={w.title}
                      className="flex items-center gap-2 rounded-md border p-2"
                    >
                      <Badge variant={workItemTypeBadgeVariant(w.type)}>
                        {w.type}
                      </Badge>
                      <span className="text-sm">{w.title}</span>
                      <Badge variant="outline" className="ml-auto text-[10px]">
                        {w.mode === "linked" ? "Linked" : "New"}
                      </Badge>
                      <button
                        onClick={() => removeItem(w.title)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Remove work item"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <AddWorkItemDialog
                    theme={theme}
                    note={item.note}
                    onAdd={addItems}
                    triggerLabel="Add another"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resolve — terminal action */}
          <div className="pt-1">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => toast.success("Marked resolved (prototype)")}
            >
              <CheckCircle className="h-4 w-4" />
              Mark resolved
            </Button>
            <p className="mt-1.5 text-center text-xs text-muted-foreground">
              Resolving closes this disagreement — the delivered result is never
              re-touched.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
