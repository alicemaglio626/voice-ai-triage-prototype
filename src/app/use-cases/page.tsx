import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileJson } from "lucide-react";

// Mock use cases — static stand-ins so the page looks full.
const USE_CASES = [
  { id: "uc1", name: "Unscheduled", desc: "First-contact outreach to obtain records with no prior request on file.", fields: 8, impls: 2 },
  { id: "uc2", name: "Past Due Follow Up", desc: "Follow-up on an existing records request that has passed its committed date.", fields: 10, impls: 2 },
  { id: "uc3", name: "Scheduled", desc: "Confirm a provider commitment to send records by an agreed date.", fields: 7, impls: 1 },
];

export default function UseCasesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Use cases" }]}
        title="Use cases"
        actions={
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            New use case
          </Button>
        }
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {USE_CASES.map((uc) => (
          <Card key={uc.id} className="cursor-pointer transition-colors hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                {uc.name}
                <FileJson className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{uc.desc}</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="font-normal">
                  {uc.fields} payload fields
                </Badge>
                <Badge variant="secondary">{uc.impls} implementations</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
