"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { CircleCorrect, CircleX } from "@/components/icons"
import Link from "next/link"
import { NtsApplication } from "@/types/ntsapplication"
import ApplicationRecordActions from "./record-actions"

// DEFINE THE COLUMNS OF THE Application TABLE
export const ApplicationColumns: ColumnDef<NtsApplication>[] = [
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
        accessorKey: "full_name",
        header: "Full name",
        cell: ({ row }) => {
            const id = row.original.id
            const full_name = row.getValue("full_name") as string
        
            return (
                <Link
                    href={`/nts/${id}`}
                    className="text-blue-600 hover:underline"
                >
                    {full_name}
                </Link>
            )
        },
    },
    {
        accessorKey: "nic",
        header: "NIC",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => {
            const show = row.getValue("visibility")
            return show === true ? (
                <CircleCorrect className="text-green-500 w-7 h-7" />
            ) : (
                <CircleX className="text-red-500 w-7 h-7" />
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ApplicationRecordActions row={row} />,
    },
]
