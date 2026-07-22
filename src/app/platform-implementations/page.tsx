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

// Mock platform implementations — static stand-ins so the page looks full.
const IMPLS = [
  { id: "i1", useCase: "Unscheduled", platform: "SYLLABLE", updated: "2026-07-07" },
  { id: "i2", useCase: "Unscheduled", platform: "COGNIGY", updated: "2026-06-28" },
  { id: "i3", useCase: "Past Due Follow Up", platform: "SYLLABLE", updated: "2026-07-05" },
  { id: "i4", useCase: "Past Due Follow Up", platform: "COGNIGY", updated: "2026-06-22" },
  { id: "i5", useCase: "Scheduled", platform: "SYLLABLE", updated: "2026-07-01" },
];

export default function ImplementationsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Implementations" }]}
        title="Platform implementations"
        actions={
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            New implementation
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Use case</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Config</TableHead>
            <TableHead>Last updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {IMPLS.map((i) => (
            <TableRow key={i.id} className="cursor-pointer">
              <TableCell className="font-medium">{i.useCase}</TableCell>
              <TableCell>
                <Badge
                  variant={i.platform === "SYLLABLE" ? "default" : "secondary"}
                >
                  {i.platform}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                config.json
              </TableCell>
              <TableCell className="text-sm text-muted-foreground tabular-nums">
                {i.updated}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
