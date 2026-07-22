import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

// Mock call records — static stand-ins so the explorer looks full.
const OUTCOMES = [
  "Scheduled",
  "Left Voicemail",
  "Member Not Verified",
  "Human Hung Up",
  "No Answer",
  "On Track",
];
const USE_CASES = ["Unscheduled", "Past Due Follow Up", "Scheduled"];
const CONF = ["high", "high", "low", "high", "low", "high"];

function mkRows() {
  const rows = [];
  for (let i = 0; i < 16; i++) {
    const phone = `${200 + ((i * 37) % 799)}${100 + ((i * 53) % 899)}${String((i * 7919) % 10000).padStart(4, "0")}`;
    rows.push({
      id: (0x1a2b0000 + i * 2617).toString(16).slice(0, 8),
      phone,
      useCase: USE_CASES[i % USE_CASES.length],
      outcome: OUTCOMES[i % OUTCOMES.length],
      conf: CONF[i % CONF.length],
      dur: `${1 + (i % 4)}:${String((i * 13) % 60).padStart(2, "0")}`,
      date: `2026-07-${String(8 - (i % 8)).padStart(2, "0")}`,
    });
  }
  return rows;
}
const ROWS = mkRows();

export default function CallExplorerPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Calls" }, { label: "Call explorer" }]}
        title="Call explorer"
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by phone or call ID" className="h-9 pl-8" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Use case</Label>
          <Select defaultValue="all">
            <SelectTrigger className="w-44" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All use cases</SelectItem>
              {USE_CASES.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Outcome</Label>
          <Select defaultValue="all">
            <SelectTrigger className="w-52" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All outcomes</SelectItem>
              {OUTCOMES.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Confidence</Label>
          <Select defaultValue="all">
            <SelectTrigger className="w-36" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">{ROWS.length} calls</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Call ID</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Use case</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((r) => (
            <TableRow key={r.id} className="cursor-pointer">
              <TableCell className="font-mono text-xs text-muted-foreground">
                {r.id}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                {r.phone}
              </TableCell>
              <TableCell className="text-sm">{r.useCase}</TableCell>
              <TableCell className="text-sm">{r.outcome}</TableCell>
              <TableCell>
                <Badge variant={r.conf === "high" ? "outline" : "warning"}>
                  {r.conf}
                </Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {r.dur}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground tabular-nums">
                {r.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
