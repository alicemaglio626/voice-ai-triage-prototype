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
import { AlertTriangle, CheckCircle, Volume2, X } from "lucide-react";
import { TRIAGE_MOCK } from "../mock-data";
import { deriveTheme, deriveWhoEnded, workItemTypeBadgeVariant } from "../bucketing";
import { callTypeFor, mockTranscript, mockMachineOpinions } from "../detail-mock";
import { AddWorkItemDialog, type LinkedWorkItem } from "../add-work-item-dialog";

const DISPOSITIONS = [
  "On Track",
  "Scheduled",
  "Left Voicemail",
  "Member Not Verified",
  "Provider Requested Payment",
  "Human Hung Up",
  "Working as intended (non-success)",
];

export default function CallDetailPage() {
  const params = useParams<{ callId: string }>();
  const item = TRIAGE_MOCK.find((i) => i.call_id === params.callId);
  const [workItems, setWorkItems] = useState<LinkedWorkItem[]>([]);
  const [disposition, setDisposition] = useState<string>();

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
  const transcript = mockTranscript(item.note, theme, whoEnded);
  const opinions = mockMachineOpinions(theme);

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Triage (prototype)", href: "/triage-prototype" },
          { label: `Call ${item.call_id}` },
        ]}
      />
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="outline">{callType}</Badge>
        <span>{item.created_date}</span>
        <span>· ended by {whoEnded}</span>
      </div>

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

        {/* RIGHT — escalation, machine opinions, work items */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Escalation</Badge>
                <span className="text-sm text-muted-foreground">
                  {callType}
                </span>
              </div>
              <CardTitle>Escalated for R&amp;D review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm font-medium">
                This call was escalated by the reviewer.
              </p>
              <div className="rounded-md border p-3 text-sm text-muted-foreground">
                {item.note}
              </div>
            </CardContent>
          </Card>

          {/* Delivered classification — the auto result, changeable at triage */}
          <Card className="ring-2 ring-[#7c8cef]/60">
            <CardHeader>
              <CardTitle className="text-base">Delivered classification</CardTitle>
              <p className="text-sm text-muted-foreground">
                The auto result delivered for this call. Change it if triage
                finds the delivered outcome was wrong.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 rounded-md border p-2">
                <Badge variant="outline">Delivered</Badge>
                <span className="text-sm">{opinions.delivered}</span>
              </div>
              <div className="space-y-1.5">
                <Label>Set outcome</Label>
                <Select
                  value={disposition}
                  onValueChange={(v) => {
                    setDisposition(v);
                    toast.success(`Outcome set to “${v}”`);
                  }}
                >
                  <SelectTrigger className="w-full">
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
                {disposition && disposition !== opinions.delivered && (
                  <p className="text-xs text-muted-foreground">
                    Overrides delivered &ldquo;{opinions.delivered}&rdquo; — the
                    call record updates on resolve.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Work items → resolve — one connected flow */}
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

          {/* Resolve — terminal action for either/both edits above */}
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
              Resolving closes this triage entry — resolve once you&rsquo;ve set
              the disposition and/or added any work items (or if nothing&rsquo;s
              actionable).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
