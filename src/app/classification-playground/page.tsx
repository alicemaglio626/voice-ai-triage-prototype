import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const SAMPLE = `AGENT: Hi, I'm Jessica, an automated assistant from Datavant calling on behalf of the health plan about a medical records request.
HUMAN: We can't release records over the phone — you'll need to fax the request.
AGENT: Understood. Can I confirm the fax number for records?
HUMAN: It's on our website. Goodbye.`;

export default function ClassificationPlaygroundPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Classification" }]}
        title="Classification playground"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transcript</CardTitle>
            <p className="text-sm text-muted-foreground">
              Paste a call transcript to see how the classifiers label it.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>Transcript</Label>
              <Textarea rows={12} defaultValue={SAMPLE} className="font-mono text-xs" />
            </div>
            <Button className="w-full gap-1.5">
              <Sparkles className="h-4 w-4" />
              Classify
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Classifier output</CardTitle>
            <p className="text-sm text-muted-foreground">
              Judge and structured classifiers, side by side.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 rounded-md border p-3">
              <span className="text-sm text-muted-foreground">Judge</span>
              <Badge className="ml-auto">Provider Requires Fax</Badge>
              <Badge variant="outline">high</Badge>
            </div>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <span className="text-sm text-muted-foreground">Structured</span>
              <Badge className="ml-auto">Human Hung Up</Badge>
            </div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              Classifiers disagree — this run would be sent to triage as a{" "}
              <span className="font-medium">System Escalation</span>.
            </div>
            <div className="space-y-1.5 rounded-md bg-muted/40 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Reasoning (judge)
              </p>
              <p className="text-sm text-muted-foreground">
                The provider declined to release records by phone and directed
                the caller to fax, indicating a fax-handling path rather than a
                refusal or a human hang-up.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
