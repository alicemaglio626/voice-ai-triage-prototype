import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone } from "lucide-react";

export default function TestCallPage() {
  return (
    <div className="space-y-4">
      <PageHeader breadcrumbs={[{ label: "Test calls" }]} title="Test calls" />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Place a test call</CardTitle>
          <p className="text-sm text-muted-foreground">
            Dial a number with a chosen use case to hear the assistant live.
            Test calls are isolated from production batches.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Phone number</Label>
            <Input placeholder="(555) 123-4567" />
          </div>
          <div className="space-y-1.5">
            <Label>Use case</Label>
            <Select defaultValue="Unscheduled">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unscheduled">Unscheduled</SelectItem>
                <SelectItem value="Past Due Follow Up">Past Due Follow Up</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Platform</Label>
            <Select defaultValue="SYLLABLE">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SYLLABLE">Syllable</SelectItem>
                <SelectItem value="COGNIGY">Cognigy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full gap-1.5">
            <Phone className="h-4 w-4" />
            Place test call
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
