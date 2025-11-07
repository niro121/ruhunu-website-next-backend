"use client"

import { CircleCorrect, CircleX } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import { Career } from "@/types/career"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import CenterRecordActions from "./record-actions"
import { Center } from "@/types/center"

// DEFINE THE COLUMNS OF THE CAREER TABLE
export const centersColumns: ColumnDef<Center>[] = [
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
        accessorKey: "area",
        header: "Area",
        cell: ({ row }) => {
            const id = row.original.id
            const name = row.getValue("area") as string
        
            return (
                <Link
                    href={`/collecting-centers/${id}`}
                    className="text-blue-600 hover:underline"
                >
                    {name}
                </Link>
            )
        },
    },
    {
        accessorKey: "centers",
        header: "Center Count",
        cell: ({ row }) => {
            const centers = row.original.centers ?? [];
            return centers.length;
        }
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
        cell: ({ row }) => <CenterRecordActions row={row} />,
    },
]