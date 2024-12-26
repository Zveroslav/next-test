import { ColumnDef, flexRender, Table } from "@tanstack/react-table";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Review } from "../types";

interface ReviewsTableProps {
    table:   Table<ColumnDef<Review & { delete: string }>>;
    handleDelete: (id: number) => void;
}

export const ReviewsTable: React.FC<ReviewsTableProps> = ({ table, handleDelete }) => (
<div style={{ height: 400, width: "100%" }}>
    <div className="flex border-b border-gray-300 bg-gray-100 dark:bg-[#3c3c3c]">
        {table.getHeaderGroups().map((headerGroup) => (
            headerGroup.headers.map((header) => (
                <div
                    tabIndex={0}
                    key={header.id}
                    className="flex-1 px-4 py-2 border-r border-gray-300 last:border-0 text-left font-bold cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                >
                    {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === "function"
                            ? header.column.columnDef.header(header.getContext())
                            : header.column.columnDef.header}
                    {header.column.getIsSorted() === "asc" ? " 🔼" : header.column.getIsSorted() === "desc" ? " 🔽" : ""}
                </div>
            ))
        ))}
    </div>
    <AutoSizer>
        {({ height, width }) => (
            <FixedSizeList
                height={height - 50}
                itemCount={table.getRowModel().rows.length}
                itemSize={50}
                overscanCount={10}
                width={width}
            >
                {({ index, style }) => {
                    const row = table.getRowModel().rows[index];
                    return (
                        <div
                            key={row.id}
                            style={style}
                            className="flex border-b border-gray-300 even:bg-gray-50 dark:even:bg-[#3c3c3c] dark:hover:text-black"
                        >
                            {row.getVisibleCells().map((cell) => {
                                return (
                                    <div
                                        key={cell.id}
                                        className="flex-1 px-4 py-2 border-r border-gray-300 last:border-0"
                                    >
                                        {
                                            (cell.column.id === "delete" && (
                                                <button
                                                    onClick={() => handleDelete(Number(row.original.id) as number)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                >
                                                    X
                                                </button>
                                            )) ||
                                            (flexRender(cell.column.columnDef.cell, cell.getContext()) as React.ReactNode)}
                                    </div>
                                )
                            })}
                        </div>
                    );
                }}
            </FixedSizeList>
        )}
    </AutoSizer>
</div>
);