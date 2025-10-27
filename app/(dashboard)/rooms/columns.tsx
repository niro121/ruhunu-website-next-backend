"use client"

import { CircleCorrect, CircleX } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import { NewsLetter } from "@/types/news-letter"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import RoomsRecordActions from "./record-actions"
import { Rooms } from "@/types/room"

export const roomsColumns: ColumnDef<Rooms>[] = [
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
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const id = row.original.id
            const name = row.getValue("name") as string
        
            return (
                <Link
                    href={`/rooms/${id}`}
                    className="text-blue-600 hover:underline"
                >
                    {name}
                </Link>
            )
        },
    },
    {
        accessorKey: "order",
        header: "Order",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
            const year = date.getFullYear();

            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            return `${year}/${month}/${day} ${hours}:${minutes}`;
        },
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
        cell: ({ row }) => <RoomsRecordActions row={row} />,
    },
]