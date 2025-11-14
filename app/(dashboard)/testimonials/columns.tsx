"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Testimonial } from "@/types/testimonial"
import TestimonialRecordActions from "./record-actions"
import { Star } from "lucide-react"

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
        accessorKey: "testimonial",
        header: "Testimonial",
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
            const rating = row.getValue("rating") as number
            const id = row.original.id
    
            // You can call an update action here if needed
            const handleRatingClick = (newRating: number) => {
                // Update only the row's data inside the table
                row.toggleSelected(false) // prevent row selection when clicking stars
                row._valuesCache.rating = newRating
    
                // If you want to trigger a backend update, call it here:
                // updateTestimonial(id, { rating: newRating })
            }
    
            return (
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={18}
                            className={`cursor-pointer ${
                                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => handleRatingClick(star)}
                        />
                    ))}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <TestimonialRecordActions row={row} />,
    },
]
