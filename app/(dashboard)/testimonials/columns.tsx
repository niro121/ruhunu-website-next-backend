"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { CircleCorrect, CircleX } from "@/components/icons"
import Link from "next/link"
import { Testimonial } from "@/types/testimonial"
import TestimonialRecordActions from "./record-actions"

// DEFINE THE COLUMNS OF THE TESTIMONIAL TABLE
export const testimonialColumns: ColumnDef<Testimonial>[] = [
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
                    href={`/testimonials/${id}`}
                    className="text-blue-600 hover:underline"
                >
                    {name}
                </Link>
            )
        },
    },
    {
        accessorKey:"name",
        header:"Name",
    },
    {
        accessorKey: "testimonial",
        header: "Testimonial",
    },
    {
        accessorKey:"rating",
        header:"Rating",
    },
    {
        id: "actions",
        cell: ({ row }) => <TestimonialRecordActions row={row} />,
    },
]
