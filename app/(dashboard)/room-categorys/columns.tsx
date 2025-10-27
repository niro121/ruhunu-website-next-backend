"use client"

import { CircleCorrect, CircleX } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import { NewsLetter } from "@/types/news-letter"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Rooms } from "@/types/room"
import { RoomsCategory } from "@/types/rooms-category"
import RoomCategoryRecordActions from "./record-actions"

export const roomCategoryColumns: ColumnDef<RoomsCategory>[] = [
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
                    href={`/room-categorys/${id}`}
                    className="text-blue-600 hover:underline"
                >
                    {name}
                </Link>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created Date",
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
        cell: ({ row }) => <RoomCategoryRecordActions row={row} />,
    },
]