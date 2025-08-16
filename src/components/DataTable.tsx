import React, { useMemo, useState } from "react";
import { clsx } from "clsx";

export type Column<T> = {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
};

export type DataTableProps<T extends { id?: string | number }> = {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  emptyText?: string;
  className?: string;
};

type SortState<T> = { key: keyof T; direction: "asc" | "desc" } | null;

export function DataTable<T extends { id?: string | number }>(props: DataTableProps<T>) {
  const { data, columns, loading = false, selectable = false, onRowSelect, emptyText = "No data", className } = props;

  const [sort, setSort] = useState<SortState<T>>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const sorted = useMemo(() => {
    if (!sort) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sort.direction === "asc" ? -1 : 1;
      if (av > bv) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, sort]);

  const allChecked = selectable && data.length > 0 && selectedIds.size === data.length;

  const toggleAll = () => {
    if (!selectable) return;
    const next = new Set<string | number>();
    if (!allChecked) data.forEach((r, i) => next.add(r.id ?? i));
    setSelectedIds(next);
    onRowSelect?.(data.filter((r, i) => next.has(r.id ?? i)));
  };

  const toggleRow = (row: T, idx: number) => {
    if (!selectable) return;
    const id = row.id ?? idx;
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
    onRowSelect?.(data.filter((r, i) => next.has(r.id ?? i)));
  };

  const onSort = (c: Column<T>) => {
    if (!c.sortable) return;
    const key = c.dataIndex as keyof T;
    setSort((prev) => (!prev || prev.key !== key ? { key, direction: "asc" } : { key, direction: prev.direction === "asc" ? "desc" : "asc" }));
  };

  return (
    <div
      className={clsx("w-full overflow-x-auto rounded-xl border border-zinc-200", className)}
      role="table"
      aria-busy={loading}
    >
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-100">
          <tr>
            {selectable && (
              <th className="px-3 py-2 w-10">
                <input
                  type="checkbox"
                  aria-label={allChecked ? "Deselect all rows" : "Select all rows"}
                  checked={allChecked}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((c) => (
              <th
                key={c.key}
                className={clsx(
                  "px-3 py-2 font-semibold text-zinc-800 select-none",
                  c.sortable && "cursor-pointer"
                )}
                onClick={() => onSort(c)}
                aria-sort={
                  sort?.key === (c.dataIndex as keyof any)
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                scope="col"
              >
                <span className="inline-flex items-center gap-1">
                  {c.title}
                  {c.sortable && sort?.key === (c.dataIndex as keyof any) && (
                    <span aria-hidden>{sort.direction === "asc" ? "▲" : "▼"}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {selectable && (
                  <td className="px-3 py-3">
                    <div className="h-4 w-4 bg-zinc-200 rounded" />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-3">
                    <div className="h-4 w-32 bg-zinc-200 rounded" />
                  </td>
                ))}
              </tr>
            ))
          ) : sorted.length === 0 ? (
            <tr>
              <td
                className="px-3 py-6 text-center text-zinc-500"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => {
              const id = row.id ?? i;
              const checked = selectable && selectedIds.has(id);
              return (
                <tr
                  key={String(id)}
                  className="border-t border-zinc-200 hover:bg-zinc-50/80"
                >
                  {selectable && (
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${i + 1}`}
                        checked={checked}
                        onChange={() => toggleRow(row, i)}
                      />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2 text-zinc-800">
                      {c.render
                        ? c.render((row as any)[c.dataIndex], row)
                        : ((row as any)[c.dataIndex])?.toString?.() ?? ""}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
