import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

// Mock phone management — static stand-ins so the page looks full.
const NUMBERS = [
  { id: "n1", number: "(415) 555-0142", label: "Outbound — West", status: "Active", calls: 1284 },
  { id: "n2", number: "(512) 555-0188", label: "Outbound — Central", status: "Active", calls: 903 },
  { id: "n3", number: "(212) 555-0176", label: "Outbound — East", status: "Active", calls: 1512 },
  { id: "n4", number: "(305) 555-0119", label: "Outbound — Southeast", status: "Paused", calls: 214 },
];

const DNC = [
  { id: "d1", number: "(210) 555-0133", added: "2026-07-02", reason: "Provider requested" },
  { id: "d2", number: "(646) 555-0197", added: "2026-06-28", reason: "Wrong number" },
  { id: "d3", number: "(408) 555-0155", added: "2026-06-19", reason: "Provider requested" },
];

export default function PhoneManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Phone management" }]}
        title="Phone management"
      />
      <Tabs defaultValue="numbers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="numbers">Outbound numbers</TabsTrigger>
          <TabsTrigger value="dnc">Do-not-call list</TabsTrigger>
        </TabsList>

        <TabsContent value="numbers" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add number
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Calls placed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NUMBERS.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono text-sm">{n.number}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{n.label}</TableCell>
                  <TableCell>
                    <Badge variant={n.status === "Active" ? "outline" : "secondary"}>
                      {n.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{n.calls}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="dnc" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add to DNC
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DNC.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-sm">{d.number}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.reason}</TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">
                    {d.added}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
