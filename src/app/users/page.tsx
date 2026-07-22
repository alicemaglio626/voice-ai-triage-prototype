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

// Mock users — static stand-ins so the page looks full.
const USERS = [
  { id: "u1", name: "Alice Maglio", email: "alice.maglio@datavant.com", role: "Designer", created: "2026-05-02" },
  { id: "u2", name: "Isaac Chen", email: "isaac.chen@datavant.com", role: "Product", created: "2026-04-18" },
  { id: "u3", name: "Rosa Diaz", email: "rosa.diaz@datavant.com", role: "Ops reviewer", created: "2026-03-11" },
  { id: "u4", name: "Marcus Webb", email: "marcus.webb@datavant.com", role: "Engineer", created: "2026-02-27" },
  { id: "u5", name: "Priya Nair", email: "priya.nair@datavant.com", role: "Ops reviewer", created: "2026-02-09" },
];

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Users" }]}
        title="Users"
        actions={
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add user
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {USERS.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {u.role}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {u.created}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
