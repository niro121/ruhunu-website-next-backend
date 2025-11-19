"use client"

import { CircleCorrect, CircleX } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import { Page } from "@/types/page"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import PageRecordActions from "./record-actions"

// DEFINE THE COLUMNS OF THE CAREER TABLE
export const pagesColumns: ColumnDef<Page>[] = [
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
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const id = row.original.id
            const title = row.getValue("title") as string
        
            return (
                <Link
                    href={`/cms-manager/${id}`}
                    className="text-blue-600 hover:underline"
                >
                    {title}
                </Link>
            )
        },
    },
    {
        accessorKey: "metaTitle",
        header: "Meta Title",
    },
    {
        accessorKey: "metaDescription",
        header: "Meta Description",
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => {
            const show = row.getValue('visibility')
            return show === true ? (
                <CircleCorrect className="text-green-500 w-7 h-7" />
            ) : (
                <CircleX className="text-red-500 w-7 h-7" />
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <PageRecordActions row={row} />,
    },
]