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

// Mock batch list — static stand-ins so the page looks full in the prototype.
const BATCHES = [
  { id: "b1", name: "Unscheduled — TX region", useCase: "Unscheduled", finished: 82, inReview: 6, errored: 2, total: 100, created: "2026-07-08" },
  { id: "b2", name: "Past due follow-up — wave 4", useCase: "Past Due Follow Up", finished: 140, inReview: 12, errored: 3, total: 160, created: "2026-07-06" },
  { id: "b3", name: "Scheduled confirmations", useCase: "Scheduled", finished: 55, inReview: 0, errored: 1, total: 60, created: "2026-07-03" },
  { id: "b4", name: "Unscheduled — FL region", useCase: "Unscheduled", finished: 44, inReview: 9, errored: 0, total: 75, created: "2026-06-30" },
  { id: "b5", name: "Past due follow-up — wave 3", useCase: "Past Due Follow Up", finished: 200, inReview: 0, errored: 4, total: 204, created: "2026-06-24" },
];

export default function BatchesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Batches" }]}
        title="Batches"
        actions={
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            New batch
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Use case</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Calls</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {BATCHES.map((b) => {
            const pct = Math.round((b.finished / b.total) * 100);
            return (
              <TableRow key={b.id} className="cursor-pointer">
                <TableCell className="font-medium">{b.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {b.useCase}
                </TableCell>
                <TableCell className="w-48">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-datavant-teal"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="font-normal">
                      {b.finished} finished
                    </Badge>
                    {b.inReview > 0 && (
                      <Badge variant="warning">{b.inReview} in review</Badge>
                    )}
                    {b.errored > 0 && (
                      <Badge variant="destructive">{b.errored} errored</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{b.total}</TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {b.created}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
