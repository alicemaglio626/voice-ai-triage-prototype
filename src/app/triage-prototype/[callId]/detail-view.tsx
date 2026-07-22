"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Volume2,
  X,
} from "lucide-react";
import { TRIAGE_MOCK } from "../mock-data";
import { deriveTheme, deriveWhoEnded, workItemTypeBadgeVariant } from "../bucketing";
import {
  callTypeFor,
  mockTranscript,
  mockMachineOpinions,
  reasonFor,
  opsCaptureFor,
} from "../detail-mock";
import { AddWorkItemDialog, type LinkedWorkItem } from "../add-work-item-dialog";

const DISPOSITIONS = [
  "On Track",
  "Scheduled",
  "Left Voicemail",
  "Member Not Verified",
  "Provider Requested Payment",
  "Human Hung Up",
  "No Answer",
];

export default function CallDetailPage() {
  const params = useParams<{ callId: string }>();
  const item = TRIAGE_MOCK.find((i) => i.call_id === params.callId);
  const [workItems, setWorkItems] = useState<LinkedWorkItem[]>([]);
  const [disposition, setDisposition] = useState<string>();
  const [showDetails, setShowDetails] = useState(false);

  const addItems = (items: LinkedWorkItem[]) =>
    setWorkItems((prev) => {
      const have = new Set(prev.map((w) => w.title));
      return [...prev, ...items.filter((w) => !have.has(w.title))];
    });
  const removeItem = (t: string) =>
    setWorkItems((prev) => prev.filter((w) => w.title !== t));

  if (!item) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Call not found"
        description="This call isn't in the prototype sample."
        action={{ label: "Back to Triage", href: "/triage-prototype" }}
      />
    );
  }

  const { theme } = deriveTheme(item.note);
  const whoEnded = deriveWhoEnded(item.note);
  const callType = callTypeFor(item.call_id);
  const reason = reasonFor(item.call_id);
  const { aiMistake, frustrated } = opsCaptureFor(item.call_id);
  const transcript = mockTranscript(item.note, theme, whoEnded);
  const opinions = mockMachineOpinions(theme);

  // Resolving requires a real triage action: the classification actually
  // changed from what was delivered, OR a work item was added.
  const canResolve =
    (!!disposition && disposition !== opinions.delivered) ||
    workItems.length > 0;

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Triage", href: "/triage-prototype" },
          { label: `Call ${item.call_id}` },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* LEFT — recording + transcript */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Call data</CardTitle>
              <p className="text-sm text-muted-foreground">
                Transcript &amp; recording — the &ldquo;why&rdquo; behind the
                call.
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

        {/* RIGHT — grey panel; cards scroll over it, resolve pinned at the bottom */}
        <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl bg-muted/50 lg:sticky lg:top-4 lg:self-start">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            {/* Escalation — reason + what the reviewer captured */}
            <Card>
              <CardHeader className="gap-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal">
                    {reason}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {callType}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {reason === "Ops Escalation" ? (
                  <>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        Jessica made a mistake
                      </div>
                      {aiMistake ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="warning">Yes</Badge>
                          <span>{aiMistake}</span>
                        </div>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        Provider got frustrated
                      </div>
                      {frustrated ? (
                        <Badge
                          variant={frustrated === "Yes" ? "warning" : "outline"}
                        >
                          {frustrated}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          Not captured
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    The system couldn&rsquo;t confidently identify the outcome
                    for this call.
                  </p>
                )}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    {reason === "Ops Escalation" ? "Reviewer note" : "Details"}
                  </div>
                  <div className="rounded-md border p-3 text-muted-foreground">
                    {item.note}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Machine opinions — judge + structured classifiers for this run */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Machine opinions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  The judge and structured classifiers for this run. Non-blind by
                  design — resolve the escalation with this context.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 rounded-md border p-2.5">
                  <span className="text-sm text-muted-foreground">Judge</span>
                  <Badge className="ml-auto">{opinions.judgeOutcome}</Badge>
                  <Badge variant="outline" className="capitalize">
                    {opinions.judgeConfidence}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-2.5">
                  <span className="text-sm text-muted-foreground">
                    Structured
                  </span>
                  <Badge className="ml-auto">{opinions.structuredOutcome}</Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center gap-1 font-normal"
                  onClick={() => setShowDetails((s) => !s)}
                >
                  {showDetails ? "Hide details" : "Show details"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
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
                        {opinions.judgeConfidence}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivered classification — the auto result, changeable at triage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Delivered classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 rounded-md border p-2">
                  <Badge variant="outline">Delivered</Badge>
                  <span className="text-sm">{opinions.delivered}</span>
                </div>
                <div className="space-y-1.5">
                  <Label>Set outcome</Label>
                  <div className="relative">
                    <Select
                      value={disposition}
                      onValueChange={(v) => {
                        setDisposition(v);
                        toast.success(`Outcome set to “${v}”`);
                      }}
                    >
                      <SelectTrigger className="w-full pr-14">
                        <SelectValue placeholder="Keep delivered outcome" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISPOSITIONS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {disposition && (
                      <button
                        type="button"
                        aria-label="Clear outcome"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDisposition(undefined);
                          toast.success("Outcome cleared");
                        }}
                        className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {disposition && disposition !== opinions.delivered && (
                    <p className="text-xs text-muted-foreground">
                      Overrides delivered &ldquo;{opinions.delivered}&rdquo; — the
                      call record updates on resolve.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work items */}
            <Card>
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
          </div>

          {/* Pinned resolve footer — spans the panel */}
          <Card className="shrink-0 gap-0 rounded-none border-x-0 border-b-0 py-4">
            <CardContent className="space-y-1.5 px-6">
              <Button
                variant="outline"
                className="w-full gap-2"
                disabled={!canResolve}
                onClick={() => toast.success("Marked resolved (prototype)")}
              >
                <CheckCircle className="h-4 w-4" />
                Mark resolved
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Set a new outcome or add a work item to resolve.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
