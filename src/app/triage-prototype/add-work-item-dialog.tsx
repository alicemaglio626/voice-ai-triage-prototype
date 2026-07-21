"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";
import {
  suggestWorkItem,
  workItemTypeBadgeVariant,
  type WorkItemType,
} from "./bucketing";

const TYPES: WorkItemType[] = [
  "Bug",
  "New capability",
  "Vendor failure",
  "Not actionable",
];

const EXISTING_WORK_ITEMS: { title: string; type: WorkItemType }[] = [
  { title: "Jessica gave up prematurely", type: "Bug" },
  { title: "Member not verified", type: "New capability" },
  { title: "Did not handle/leave voicemail", type: "Bug" },
  { title: "IVR Navigation issues", type: "Bug" },
  { title: "Speak to a real person", type: "New capability" },
  { title: 'Unable to recognise "fax"', type: "Bug" },
  { title: "Push the provider to transfer to someone who can help", type: "New capability" },
  { title: "Provider office hang-up", type: "Not actionable" },
  { title: "Commitment date defaulted without confirmation", type: "Bug" },
  { title: "Handle reroute scenarios", type: "New capability" },
  { title: "Telephony dropout corrupted the transcript", type: "Vendor failure" },
];

export interface LinkedWorkItem {
  title: string;
  type: WorkItemType;
  mode: "linked" | "new";
}

export function AddWorkItemDialog({
  theme,
  note,
  onAdd,
  triggerLabel = "Add work item",
}: {
  theme: string;
  note: string;
  onAdd: (items: LinkedWorkItem[]) => void;
  triggerLabel?: string;
}) {
  const s = suggestWorkItem(theme);
  const hasSuggested = !!s.existing;

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Create-new is only pre-filled when there is NO suggested existing match —
  // otherwise we'd nudge toward duplicating an item we should be linking.
  const [type, setType] = useState<WorkItemType>(
    hasSuggested ? "Bug" : s.draftType,
  );
  const [title, setTitle] = useState(hasSuggested ? "" : s.draftTitle);
  const [description, setDescription] = useState(hasSuggested ? "" : note);

  // The "other" items — everything except the suggested one, filtered by search.
  const others = useMemo(() => {
    const query = q.trim().toLowerCase();
    return EXISTING_WORK_ITEMS.filter(
      (w) =>
        w.title !== s.existing?.title &&
        (!query || w.title.toLowerCase().includes(query)),
    );
  }, [q, s.existing]);

  const reset = () => {
    setSelected(new Set());
    setQ("");
    setType(hasSuggested ? "Bug" : s.draftType);
    setTitle(hasSuggested ? "" : s.draftTitle);
    setDescription(hasSuggested ? "" : note);
  };
  const close = () => {
    setOpen(false);
    reset();
  };

  const toggle = (t: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  const linkSelected = () => {
    const catalog = s.existing
      ? [
          s.existing,
          ...EXISTING_WORK_ITEMS.filter((w) => w.title !== s.existing!.title),
        ]
      : EXISTING_WORK_ITEMS;
    const items: LinkedWorkItem[] = catalog
      .filter((w) => selected.has(w.title))
      .map((w) => ({ title: w.title, type: w.type, mode: "linked" }));
    onAdd(items);
    toast.success(`Linked ${items.length} work item${items.length > 1 ? "s" : ""}`);
    close();
  };
  const fileNew = () => {
    onAdd([{ title: title.trim(), type, mode: "new" }]);
    toast.success(`Filed: ${title.trim()}`);
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
      <DialogTrigger asChild>
        <Button className="gap-1">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add work item</DialogTitle>
          <DialogDescription>
            Link this call to existing work items, or create a new one.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link existing</TabsTrigger>
            <TabsTrigger value="new">Create new</TabsTrigger>
          </TabsList>

          {/* LINK EXISTING */}
          <TabsContent value="link" className="space-y-4 pt-3">
            {/* Suggested — pinned above the list, one-click link */}
            {s.existing && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Suggested for this call
                </div>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-primary/50 bg-primary/5 p-2.5 hover:bg-primary/10">
                  <Checkbox
                    checked={selected.has(s.existing.title)}
                    onCheckedChange={() => toggle(s.existing!.title)}
                  />
                  <Badge variant={workItemTypeBadgeVariant(s.existing.type)}>
                    {s.existing.type}
                  </Badge>
                  <span className="text-sm">{s.existing.title}</span>
                </label>
              </div>
            )}

            {/* Everything else — multi-select */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                {hasSuggested ? "Other open work items" : "All open work items"}
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search work items…"
                  className="pl-8"
                />
              </div>
              <div className="max-h-48 divide-y overflow-y-auto rounded-md border">
                {others.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">
                    No matching work items.
                  </p>
                ) : (
                  others.map((w) => (
                    <label
                      key={w.title}
                      className="flex cursor-pointer items-center gap-2.5 p-2.5 hover:bg-muted/40"
                    >
                      <Checkbox
                        checked={selected.has(w.title)}
                        onCheckedChange={() => toggle(w.title)}
                      />
                      <Badge variant={workItemTypeBadgeVariant(w.type)}>
                        {w.type}
                      </Badge>
                      <span className="text-sm">{w.title}</span>
                    </label>
                  ))
                )}
              </div>
              <div className="flex justify-end">
                <Button onClick={linkSelected} disabled={selected.size === 0}>
                  Link selected{selected.size > 0 ? ` (${selected.size})` : ""}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* CREATE NEW */}
          <TabsContent value="new" className="space-y-4 pt-3">
            {!hasSuggested && (
              <p className="text-xs text-muted-foreground">
                Pre-filled from the call&rsquo;s suggested theme —{" "}
                <span className="font-medium text-foreground">{theme}</span>.
                Edit as needed.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="wi-type">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as WorkItemType)}
              >
                <SelectTrigger id="wi-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wi-title">Title</Label>
              <Input
                id="wi-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short summary of the issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wi-desc">Description</Label>
              <Textarea
                id="wi-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="What happened, and what would fix it"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={fileNew} disabled={!title.trim()}>
                File work item
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
