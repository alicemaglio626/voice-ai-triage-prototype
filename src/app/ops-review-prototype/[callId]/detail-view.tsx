"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/page-header";
import { CopyIdButton } from "@/components/shared/copy-id-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ChevronDown,
  FlaskConical,
  Keyboard,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { queueRowFor } from "../queue-mock";

const LIST = "/ops-review-prototype";
const DEFAULT_PHONE = "5551900005";
const DEFAULT_USE_CASE = "Unscheduled";
const DEFAULT_CALL_PLACED = "Jul 8, 2026, 12:01:05 PM CDT";

const OUTCOMES: { label: string; desc: string }[] = [
  { label: "On Track", desc: "Records are on the way; nothing blocking." },
  { label: "Scheduled", desc: "Provider committed to send by a date." },
  { label: "Left Voicemail", desc: "Reached a machine; message left." },
  { label: "Member Not Verified", desc: "Couldn't confirm the patient with the office." },
  { label: "Provider Requested Payment", desc: "Office wants payment before releasing records." },
  { label: "Human Hung Up", desc: "A person ended the call." },
  { label: "No Answer", desc: "No one picked up; no voicemail left." },
  { label: "None of these", desc: "Doesn't fit an outcome — sends to triage." },
];

const AI_MISTAKES = [
  "Repeated itself / looped",
  "Didn't understand",
  "Said the wrong thing at the wrong time",
  "Talked over staff",
  "Dead air / long silence",
  "Ended the call too early",
] as const;

const TRANSCRIPT = [
  { speaker: "AGENT", time: "10:14:02 AM", text: "Hi! I'm calling about a medical records request. Can you help me with that?" },
  { speaker: "HUMAN", time: "10:14:09 AM", text: "Sure, what do you need?" },
  { speaker: "AGENT", time: "10:14:14 AM", text: "My name is Jessica, I'm an automated assistant from Datavant calling on behalf of the health plan. This call is being recorded." },
  { speaker: "AGENT", time: "10:14:26 AM", text: "Can you confirm you have records for the patient, date of birth March 4th 1961?" },
  { speaker: "HUMAN", time: "10:14:31 AM", text: "Let me check… one sec." },
  { speaker: "AGENT", time: "10:14:34 AM", text: "I'm sorry, I wasn't able to verify the member." },
] as const;

export default function OpsReviewCallPage() {
  const params = useParams<{ callId: string }>();
  const router = useRouter();
  const row = queueRowFor(params.callId);

  const phone = row?.phone ?? DEFAULT_PHONE;
  const useCase = row?.callType ?? DEFAULT_USE_CASE;
  const callPlaced = row?.callPlaced ?? DEFAULT_CALL_PLACED;

  const [outcome, setOutcome] = useState<string | null>(null);
  const [aiMessedUp, setAiMessedUp] = useState<"Yes" | "No" | null>(null);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [frustrated, setFrustrated] = useState<"Yes" | "No" | null>(null);
  const [note, setNote] = useState("");

  const isNoneOfThese = outcome === "None of these";
  const goesToTriage = isNoneOfThese;
  // On the triage path, the two Yes/No axes are required before submit.
  const captureComplete = !goesToTriage || (!!aiMessedUp && !!frustrated);

  const submit = () => {
    if (!outcome || !captureComplete) return;
    toast.success(
      goesToTriage
        ? "Sent to triage — quick capture attached"
        : `Submitted: ${outcome}`,
    );
    router.push(LIST);
  };

  const cancel = () => {
    router.push(LIST);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(LIST)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title="Review this call"
          breadcrumbs={[
            { label: "Ops Review (prototype)", href: LIST },
            { label: "Review this call" },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Keyboard shortcuts (?)</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Badge variant="warning" className="gap-1">
                <FlaskConical className="h-3 w-3" />
                Prototype
              </Badge>
            </div>
          }
        />
      </div>

      <div className="-mt-3 flex items-center gap-1 pl-14 text-xs text-muted-foreground">
        <span>{phone}</span>
        <CopyIdButton value={phone} label="phone number" />
      </div>

      {/* Info bar — use case + call-placed, matching prod (blind-safe context). */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-1 rounded-md border bg-muted/30 px-4 py-2 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Use case:</span>
          <span className="font-medium">{useCase}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Call placed:</span>
          <span className="font-medium">{callPlaced}</span>
        </div>
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
                {TRANSCRIPT.map((t, i) => {
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
                  Call ended by agent at 10:14:41 AM
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — the review */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                What happened on this call?
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose the one answer that best fits. If anything you pick needs
                extra details, a short form will appear below it.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Outcome — radio list with explanations */}
              <div className="space-y-2">
                <Label>
                  Outcome<span className="text-destructive">*</span>
                </Label>
                <div className="space-y-1.5">
                  {OUTCOMES.map((o) => {
                    const active = outcome === o.label;
                    return (
                      <button
                        key={o.label}
                        onClick={() => setOutcome(o.label)}
                        className={cn(
                          "flex w-full items-start gap-2.5 rounded-md border p-2.5 text-left transition-colors",
                          active
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/40",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                            active ? "border-primary" : "border-muted-foreground/40",
                          )}
                        >
                          {active && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </span>
                        <span>
                          <span className="block text-sm font-medium">
                            {o.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {o.desc}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lightweight capture — only when the call is heading to triage */}
              {goesToTriage && (
                <div className="space-y-3 rounded-md p-3 ring-2 ring-[#7c8cef]/60">
                  <div className="text-sm font-medium">Follow-up details</div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Jessica made mistake(s)?<span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-1.5">
                      {(["Yes", "No"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setAiMessedUp(v)}
                          className={cn(
                            "flex-1 rounded-md border px-2 py-1.5 text-xs transition-colors",
                            aiMessedUp === v
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    {aiMessedUp === "Yes" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="mt-2 w-full justify-between font-normal"
                          >
                            <span
                              className={
                                mistakes.length ? "" : "text-muted-foreground"
                              }
                            >
                              {mistakes.length
                                ? `${mistakes.length} selected`
                                : "What happened? (optional)"}
                            </span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-[var(--radix-dropdown-menu-trigger-width)]"
                        >
                          {AI_MISTAKES.map((m) => (
                            <DropdownMenuCheckboxItem
                              key={m}
                              checked={mistakes.includes(m)}
                              onCheckedChange={(c) =>
                                setMistakes((prev) =>
                                  c ? [...prev, m] : prev.filter((x) => x !== m),
                                )
                              }
                              onSelect={(e) => e.preventDefault()}
                            >
                              {m}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Provider staff got frustrated?<span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-1.5">
                      {(["Yes", "No"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setFrustrated(v)}
                          className={cn(
                            "flex-1 rounded-md border px-2 py-1.5 text-xs transition-colors",
                            frustrated === v
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:bg-muted",
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="note"
                      className="text-xs text-muted-foreground"
                    >
                      Note <span className="font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Anything the options above don't capture."
                    />
                  </div>
                </div>
              )}

              {/* Submit stacked over cancel */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  disabled={!outcome || !captureComplete}
                  onClick={submit}
                >
                  Submit
                </Button>
                <Button variant="outline" className="w-full" onClick={cancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
