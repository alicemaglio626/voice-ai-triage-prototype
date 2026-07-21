"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Pagination } from "@/components/ui/pagination";
import {
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  FlaskConical,
  Search,
  X,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { TRIAGE_MOCK } from "./mock-data";
import { deriveTheme } from "./bucketing";
import {
  callTypeFor,
  callTypeBadgeVariant,
  phoneFor,
  opsCaptureFor,
  reasonFor,
  reasonBadgeClass,
  AI_MISTAKE_REASONS,
  CALL_TYPES,
  TRIAGE_REASONS,
  type CallType,
  type YesNo,
  type AiMistakeReason,
  type TriageReason,
} from "./detail-mock";

const YES_NO = ["Yes", "No"];

interface Row {
  call_id: string;
  note: string;
  created_date: string;
  theme: string;
  callType: CallType;
  phone: string;
  reason: TriageReason;
  aiMistake: AiMistakeReason | null;
  frustrated: YesNo;
}

export default function TriagePrototypePage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[{ label: "Triage (prototype)" }]}
        actions={
          <Badge variant="warning" className="gap-1">
            <FlaskConical className="h-3 w-3" />
            Prototype
          </Badge>
        }
      />
      <TriageTab />
    </div>
  );
}

function TriageTab() {
  const router = useRouter();

  const items: Row[] = useMemo(
    () =>
      TRIAGE_MOCK.map((it) => ({
        ...it,
        theme: deriveTheme(it.note).theme,
        callType: callTypeFor(it.call_id),
        phone: phoneFor(it.call_id),
        reason: reasonFor(it.call_id),
        ...opsCaptureFor(it.call_id),
      })),
    [],
  );

  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [callTypeFilter, setCallTypeFilter] = useState("all");
  const [aiMistakeFilter, setAiMistakeFilter] = useState("all");
  const [frustratedFilter, setFrustratedFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");
    const from = dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined;
    const to = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined;
    return items
      .filter((it) => {
        if (q) {
          const matches =
            it.note.toLowerCase().includes(q) ||
            it.call_id.toLowerCase().includes(q) ||
            (qDigits.length > 0 && it.phone.includes(qDigits));
          if (!matches) return false;
        }
        if (reasonFilter !== "all" && it.reason !== reasonFilter) return false;
        if (callTypeFilter !== "all" && it.callType !== callTypeFilter)
          return false;
        if (aiMistakeFilter === "All mistakes") {
          if (!it.aiMistake) return false;
        } else if (aiMistakeFilter === "No mistake") {
          if (it.aiMistake) return false;
        } else if (aiMistakeFilter !== "all" && it.aiMistake !== aiMistakeFilter) {
          return false;
        }
        if (frustratedFilter !== "all" && it.frustrated !== frustratedFilter)
          return false;
        if (from && it.created_date < from) return false;
        if (to && it.created_date > to) return false;
        return true;
      })
      .sort((a, b) =>
        sortOrder === "desc"
          ? b.created_date.localeCompare(a.created_date)
          : a.created_date.localeCompare(b.created_date),
      );
  }, [
    items,
    search,
    reasonFilter,
    callTypeFilter,
    aiMistakeFilter,
    frustratedFilter,
    dateRange,
    sortOrder,
  ]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, totalPages);
  const paged = rows.slice((current - 1) * pageSize, current * pageSize);

  const anyFilter =
    search ||
    reasonFilter !== "all" ||
    callTypeFilter !== "all" ||
    aiMistakeFilter !== "all" ||
    frustratedFilter !== "all" ||
    dateRange;

  return (
    <>
      <p className="max-w-3xl text-sm text-muted-foreground">
        Calls escalated from Ops review land here. Filter the queue by the fields
        captured during review, then open a call to review it.
      </p>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="h-9 pl-8"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <FilterSelect
          label="AI mistake"
          value={aiMistakeFilter}
          onChange={setAiMistakeFilter}
          allLabel="Any"
          options={["All mistakes", "No mistake", ...AI_MISTAKE_REASONS]}
          width="w-56"
        />
        <FilterSelect
          label="Provider frustrated"
          value={frustratedFilter}
          onChange={setFrustratedFilter}
          allLabel="Any"
          options={YES_NO}
          width="w-36"
        />
        <FilterSelect
          label="Reason"
          value={reasonFilter}
          onChange={setReasonFilter}
          allLabel="All reasons"
          options={[...TRIAGE_REASONS]}
          width="w-44"
        />
        <FilterSelect
          label="Call type"
          value={callTypeFilter}
          onChange={setCallTypeFilter}
          allLabel="All types"
          options={[...CALL_TYPES]}
          width="w-44"
        />
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Date range</Label>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-[220px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span className="text-muted-foreground">
                      Pick a date range
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {dateRange && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Clear date range"
                onClick={() => setDateRange(undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {anyFilter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              setSearch("");
              setReasonFilter("all");
              setCallTypeFilter("all");
              setAiMistakeFilter("all");
              setFrustratedFilter("all");
              setDateRange(undefined);
            }}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        {rows.length} {rows.length === 1 ? "call" : "calls"}
      </div>

      <Table className="table-fixed [&_td]:px-3 [&_th]:px-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[14%]">Phone number</TableHead>
            <TableHead className="w-[11%]">Call ID</TableHead>
            <TableHead className="w-[24%]">AI mistake</TableHead>
            <TableHead className="w-[14%]">Provider frustrated</TableHead>
            <TableHead className="w-[13%]">Reason</TableHead>
            <TableHead className="w-[13%]">Call type</TableHead>
            <TableHead className="w-[11%]">
              <button
                className="flex items-center gap-1 hover:text-foreground"
                onClick={() =>
                  setSortOrder((o) => (o === "desc" ? "asc" : "desc"))
                }
              >
                Date
                {sortOrder === "desc" ? (
                  <ArrowDown className="h-3 w-3" />
                ) : (
                  <ArrowUp className="h-3 w-3" />
                )}
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-muted-foreground"
              >
                No calls match these filters.
              </TableCell>
            </TableRow>
          ) : (
            paged.map((r) => (
              <TableRow
                key={r.call_id}
                className="cursor-pointer"
                onClick={() => router.push(`/triage-prototype/${r.call_id}`)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                  {r.phone}
                </TableCell>
                <TableCell className="truncate font-mono text-xs text-muted-foreground">
                  {r.call_id}
                </TableCell>
                <TableCell className="text-sm">
                  {r.aiMistake ? (
                    <TruncCell text={r.aiMistake} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <YesNoCell value={r.frustrated} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`font-normal ${reasonBadgeClass(r.reason)}`}
                  >
                    {r.reason}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={callTypeBadgeVariant(r.callType)}>
                    {r.callType}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {r.created_date}
                </TableCell>
              </TableRow>
            ))
          )}
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
  );
}

// Truncating cell content that only shows a tooltip when the text is clipped.
function TruncCell({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (el) setTruncated(el.scrollWidth > el.clientWidth);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text]);

  const span = (
    <span ref={ref} className="block w-full truncate">
      {text}
    </span>
  );

  if (!truncated) return span;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{span}</TooltipTrigger>
        <TooltipContent className="max-w-xs">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Yes/No/blank cell for the provider-frustrated column. Blank = not captured.
function YesNoCell({ value }: { value: YesNo }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  if (value === "No") return <Badge variant="outline">No</Badge>;
  return <Badge variant="warning">Yes</Badge>;
}

function FilterSelect({
  label,
  value,
  onChange,
  allLabel,
  options,
  width,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
  options: readonly string[];
  width: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={width} size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
