"use client";

import { useState } from 'react';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  CellContext,
} from '@tanstack/react-table';
import { Display } from '@/types/Display';

interface DisplayTableProps {
  data: Display[];
}

export default function DisplayTable({ data }: DisplayTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [touchscreenOnly, setTouchscreenOnly] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const initialVisibleColumns = data.length > 0 ? Object.keys(data[0]).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {} as Record<string, boolean>) : {};

  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTouchscreen = touchscreenOnly ? item.touchscreen : true;
    return matchesSearch && matchesTouchscreen;
  });

  const handleColumnVisibilityChange = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const columns = Object.keys(visibleColumns).map((key) => ({
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    isVisible: visibleColumns[key],
    cell: (info: CellContext<Display, unknown>) => {
      const value = info.getValue();
      if (key === 'refresh_rate') {
        return value ? `${value} Hz` : 'Unknown';
      }
      if (key === 'price' && typeof value === 'object' && value !== null) {
        const price = value as { min: number; max: number };
        return `$${price.min} - $${price.max}`;
      }
      if (key === 'links' && typeof value === 'object' && value !== null) {
        return (
          <div>
            {Object.entries(value).map(([linkType, url]) => {
              const baseSiteName = new URL(url as string).hostname.replace('www.', '');
              return (
                <div key={linkType}>
                  <a href={url as string} target="_blank" rel="noopener noreferrer">
                    {linkType.charAt(0).toUpperCase() + linkType.slice(1)} ({baseSiteName})
                  </a>
                </div>
              );
            })}
          </div>
        );
      }
      if (key === 'ratings' && Array.isArray(value)) {
        return (
          <div>
            {value.map((rating, index) => (
              <div key={index}>
                <strong>{rating.rating_avg}/{rating.rating_out_of}</strong> ({rating.count} ratings)
                {rating.positive_feedback && <div>👍 {rating.positive_feedback}</div>}
                {rating.negative_feedback && <div>👎 {rating.negative_feedback}</div>}
              </div>
            ))}
          </div>
        );
      }
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return value;
    },
  })).filter(column => column.isVisible) as ColumnDef<Display, unknown>[];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      {/* Column Visibility Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {Object.keys(visibleColumns).map((key) => (
          <div key={key} className="flex items-center">
            <input
              id={`toggle-${key}`}
              type="checkbox"
              checked={visibleColumns[key]}
              onChange={() => handleColumnVisibilityChange(key)}
              className="mr-2"
            />
            <label htmlFor={`toggle-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</label>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search brand or model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 border rounded"
        />
        <div className="flex items-center">
          <input
            id="touchscreen"
            type="checkbox"
            checked={touchscreenOnly}
            onChange={(e) => setTouchscreenOnly(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="touchscreen">Touchscreen Only</label>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b px-4 py-2 cursor-pointer select-none"
                  style={{ width: header.getSize() }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span className="ml-1">
                      {header.column.getIsSorted() === 'asc'
                        ? '🔼'
                        : header.column.getIsSorted() === 'desc'
                        ? '🔽'
                        : null}
                    </span>
                  </div>
                  <div
                    {...header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? 'isResizing' : ''
                    }`}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b px-4 py-2"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border rounded"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 border rounded"
          >
            Next
          </button>
        </div>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
}