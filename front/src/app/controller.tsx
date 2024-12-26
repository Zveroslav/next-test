import { ColumnDef } from "@tanstack/react-table";
import { Review } from "./types";

export const columns: ColumnDef<ColumnDef<Review, { delete: string }>>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ cell, row }) =>
            (<a
                href={`/review/${row.original.id}`}
                className="hover:underline"
            >
                {cell.getValue() as React.ReactNode}
            </a>),
        },
        {
            accessorKey: "content",
            header: "Content",
            cell: (info) =>
                `${info.getValue()}`.length > 10 ? `${`${info.getValue()}`.substring(0, 10)}...` : `${info.getValue()}`,
        },
        { accessorKey: "author", header: "Author", enableSorting: true },
        { accessorKey: "rating", header: "Rating", enableSorting: true },
        { accessorKey: "delete", header: "Delete", enableSorting: false },
    ]

export const apiURL = 'http://localhost:4000'