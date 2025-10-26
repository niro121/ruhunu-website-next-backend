"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { NewsLetter } from "@/types/news-letter"
import { ColumnDef } from "@tanstack/react-table"
import SubcriptionRecordActions from "./record-actions"

export const subcriptionColumns: ColumnDef<NewsLetter>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "createdAt",
        header: "Created Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <SubcriptionRecordActions row={row} />,
    },
]