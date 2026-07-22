import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock analysis metrics — static stand-ins so the page looks full in the
// prototype. No backend.
function HorizontalBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="space-y-1.5">
      <div className="flex h-2 overflow-hidden rounded-full">
        {segments.map((s) => (
          <div
            key={s.label}
            className={s.color}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${s.color}`} />
            <span className="text-[11px] text-muted-foreground">
              {s.label} <span className="tabular-nums">{s.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRECISION = [
  { name: "Judge", pct: "91%", n: "412 / 453" },
  { name: "Structured", pct: "84%", n: "380 / 453" },
];

const OUTCOMES = [
  { label: "Scheduled", n: 148, color: "bg-datavant-teal" },
  { label: "Left Voicemail", n: 96, color: "bg-datavant-violet" },
  { label: "Member Not Verified", n: 61, color: "bg-amber-400" },
  { label: "Human Hung Up", n: 44, color: "bg-rose-400" },
  { label: "No Answer", n: 39, color: "bg-slate-400" },
];

export default function AnalysisPage() {
  const outcomeTotal = OUTCOMES.reduce((s, o) => s + o.n, 0);
  return (
    <div className="space-y-4">
      <PageHeader breadcrumbs={[{ label: "R&D" }, { label: "Analysis" }]} title="Analysis" />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="px-4 py-3">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Calls analyzed
          </p>
          <p className="text-3xl font-semibold tabular-nums">453</p>
          <p className="text-xs text-muted-foreground">Finished runs, last 30 days</p>
        </Card>

        <Card className="px-4 py-3">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Classifier agreement
          </p>
          <p className="mb-3 text-3xl font-semibold tabular-nums">88%</p>
          <HorizontalBar
            segments={[
              { label: "Agree", value: 361, color: "bg-datavant-teal" },
              { label: "Disagree", value: 61, color: "bg-datavant-violet" },
              { label: "Inconclusive", value: 31, color: "bg-gray-400" },
            ]}
          />
        </Card>

        <Card className="px-4 py-3">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Escalation rate
          </p>
          <p className="text-3xl font-semibold tabular-nums">14%</p>
          <p className="text-xs text-muted-foreground">63 of 453 sent to triage</p>
        </Card>

        <Card className="px-4 py-3">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Avg call duration
          </p>
          <p className="text-3xl font-semibold tabular-nums">2:14</p>
          <p className="text-xs text-muted-foreground">Across connected calls</p>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="px-4 py-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Classifier precision
          </p>
          <p className="mb-4 text-xs text-muted-foreground">
            Match rate vs blind human ground truth
          </p>
          <div className="space-y-4">
            {PRECISION.map((p) => (
              <div key={p.name}>
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-sm tabular-nums">
                    {p.pct}{" "}
                    <span className="text-xs text-muted-foreground">{p.n}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-datavant-teal"
                    style={{ width: p.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="px-4 py-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Delivered outcomes
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outcome</TableHead>
                <TableHead className="text-right">Calls</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OUTCOMES.map((o) => (
                <TableRow key={o.label}>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${o.color}`} />
                      {o.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{o.n}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {Math.round((o.n / outcomeTotal) * 100)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
