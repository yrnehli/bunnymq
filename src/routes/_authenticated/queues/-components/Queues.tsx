import { Updater } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  Table as ReactTable,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { RefreshButton } from "@/components/RefreshButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Queue } from "@/lib/api";
import { useQueues } from "@/lib/queries";
import { cn } from "@/lib/utils";

function SortableHeader(props: {
  column: Column<Queue>;
  children: React.ReactNode;
}) {
  const { column, children } = props;

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="px-0 hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

const columns: ColumnDef<Queue>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "consumers",
    header: ({ column }) => (
      <SortableHeader column={column}>Consumers</SortableHeader>
    ),
    cell: ({ row }) => <div>{row.getValue("consumers")}</div>,
  },
  {
    accessorKey: "ready",
    header: ({ column }) => (
      <SortableHeader column={column}>Ready</SortableHeader>
    ),
    cell: ({ row }) => <div>{row.getValue("ready")}</div>,
  },
  {
    accessorKey: "unacked",
    header: ({ column }) => (
      <SortableHeader column={column}>Unacked</SortableHeader>
    ),
    cell: ({ row }) => <div>{row.getValue("unacked")}</div>,
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <SortableHeader column={column}>Total</SortableHeader>
    ),
    cell: ({ row }) => <div>{row.getValue("total")}</div>,
  },
];

export interface Queues extends React.HTMLAttributes<HTMLDivElement> {
  searchTerm?: string;
  columnVisibility: VisibilityState;
  sorting: SortingState;
  onSearchTermChange?: (searchTerm: string) => void;
  onColumnVisibilityChange: (
    updateFn: Updater<VisibilityState, VisibilityState>,
  ) => void;
  onSortingChange: (updateFn: Updater<SortingState, SortingState>) => void;
}

export function Queues({
  searchTerm: initialSearchTerm = "",
  columnVisibility,
  sorting,
  onSearchTermChange,
  onColumnVisibilityChange,
  onSortingChange,
  className,
  ...props
}: Queues) {
  const { data, isFetching, invalidateQuery } = useQueues();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "name", value: searchTerm },
  ]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearchTermChange && onSearchTermChange(searchTerm);
    }, 300);

    return () => {
      clearTimeout(debounce);
    };
  }, [onSearchTermChange, searchTerm]);

  const table = useReactTable({
    data,
    columns,
    onColumnVisibilityChange,
    onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Queues 🧑‍💻</h1>
        <RefreshButton
          onClick={() => invalidateQuery()}
          disabled={isFetching}
        />
      </div>
      <div className={cn("w-full", className)} {...props}>
        <div className="grid grid-cols-2 gap-y-2 py-4">
          <Input
            placeholder="Filter queues..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            className="col-span-2 max-w-full sm:col-span-1 sm:max-w-sm"
          />
          <div className="col-span-2 flex justify-end sm:col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <QueuesTable table={table} />
        </div>
      </div>
    </React.Fragment>
  );
}

function QueuesTable(props: { table: ReactTable<Queue> }) {
  const { table } = props;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="p-0">
                <Link
                  to="/queues/$id"
                  params={{
                    id: z.string().parse(row.getValue("name")),
                  }}
                >
                  <div className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </Link>
              </TableCell>
            ))}
          </TableRow>
        ))}
        {!table.getRowModel().rows.length && (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center text-xl font-medium"
            >
              No results 🙅
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
