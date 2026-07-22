import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { workItemTypeBadgeVariant } from "@/app/triage-prototype/bucketing";

// Mock work-item backlog — static stand-ins so the page looks full.
const WORK_ITEMS = [
  { id: "w1", title: "Jessica gave up prematurely", type: "Bug", source: "Triage", status: "Open", linked: 34, by: "A. Maglio", created: "2026-07-08" },
  { id: "w2", title: "Member not verified — expand identifiers", type: "New capability", source: "Triage", status: "In progress", linked: 21, by: "I. Chen", created: "2026-07-05" },
  { id: "w3", title: "Did not handle / leave voicemail", type: "Bug", source: "Triage", status: "Open", linked: 18, by: "A. Maglio", created: "2026-07-04" },
  { id: "w4", title: "IVR navigation issues", type: "Bug", source: "Ops Review", status: "In progress", linked: 27, by: "I. Chen", created: "2026-07-02" },
  { id: "w5", title: "Speak to a real person", type: "New capability", source: "Triage", status: "Open", linked: 15, by: "A. Maglio", created: "2026-06-29" },
  { id: "w6", title: 'Unable to recognise "fax"', type: "Bug", source: "Ops Review", status: "Open", linked: 9, by: "R. Diaz", created: "2026-06-27" },
  { id: "w7", title: "Telephony dropout corrupted the transcript", type: "Vendor failure", source: "System", status: "Watching", linked: 6, by: "System", created: "2026-06-24" },
  { id: "w8", title: "Commitment date defaulted without confirmation", type: "Bug", source: "Triage", status: "Resolved", linked: 12, by: "I. Chen", created: "2026-06-20" },
] as const;

function statusBadge(status: string) {
  if (status === "Resolved") return <Badge variant="outline">Resolved</Badge>;
  if (status === "In progress") return <Badge variant="warning">In progress</Badge>;
  if (status === "Watching") return <Badge variant="secondary">Watching</Badge>;
  return <Badge>Open</Badge>;
}

export default function WorkItemsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "R&D" }, { label: "Work items" }]}
        title="Work items"
        actions={
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            New work item
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Linked calls</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {WORK_ITEMS.map((w) => (
            <TableRow key={w.id} className="cursor-pointer">
              <TableCell className="max-w-[320px] font-medium">
                <span className="block truncate">{w.title}</span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={workItemTypeBadgeVariant(w.type)}
                  className="font-normal"
                >
                  {w.type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {w.source}
              </TableCell>
              <TableCell>{statusBadge(w.status)}</TableCell>
              <TableCell className="text-right tabular-nums">{w.linked}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{w.by}</TableCell>
              <TableCell className="text-sm text-muted-foreground tabular-nums">
                {w.created}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
