"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CheckCircle, Filter, FlaskConical, Phone, Search } from "lucide-react";
import { OPS_QUEUE, CALL_TYPES } from "./queue-mock";

export default function OpsReviewQueuePage() {
  const router = useRouter();

  const [phoneSearch, setPhoneSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    ...CALL_TYPES,
  ]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const allSelected = selectedTypes.length === CALL_TYPES.length;

  const rows = useMemo(() => {
    const q = phoneSearch.replace(/\D/g, "");
    return OPS_QUEUE.filter((r) => {
      if (!selectedTypes.includes(r.callType)) return false;
      if (q && !r.phone.includes(q)) return false;
      return true;
    });
  }, [phoneSearch, selectedTypes]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, totalPages);
  const paged = rows.slice((current - 1) * pageSize, current * pageSize);

  const toggleType = (t: string) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Ops Review" }]}
        actions={
          <Badge variant="warning" className="gap-1">
            <FlaskConical className="h-3 w-3" />
            Prototype
          </Badge>
        }
      />

      {/* Banner — matches prod's live-calls banner */}
      <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
        <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm font-medium text-foreground">
          Reviewing live calls
        </p>
      </div>

      {/* Search + call-type filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Find by phone number"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className="w-[220px] pl-8"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-1.5 h-4 w-4" />
                Call type
                {!allSelected && (
                  <Badge variant="secondary" className="ml-1.5 px-1.5">
                    {selectedTypes.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Call type</span>
                <button
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setSelectedTypes(allSelected ? [] : [...CALL_TYPES])
                  }
                >
                  {allSelected ? "Clear all" : "Select all"}
                </button>
              </div>
              <div className="space-y-2">
                {CALL_TYPES.map((t) => (
                  <label
                    key={t}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedTypes.includes(t)}
                      onCheckedChange={() => toggleType(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-xs text-muted-foreground">
          {rows.length} {rows.length === 1 ? "call" : "calls"}
        </div>
      </div>

      {selectedTypes.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No call types selected"
          description="Pick at least one call type to see calls."
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="All caught up!"
          description="No calls waiting for review right now."
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone</TableHead>
                <TableHead>Batch date</TableHead>
                <TableHead>Call type</TableHead>
                <TableHead>Waiting</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((r) => (
                <TableRow
                  key={r.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/ops-review-prototype/${r.id}`)}
                >
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      {r.phone}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {r.batchDate}
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate text-sm">
                    {r.callType}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {r.waiting}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button asChild size="sm">
                      <Link href={`/ops-review-prototype/${r.id}`}>Review</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={current}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={rows.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
