"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { NtsApplication } from "@/types/ntsapplication"
import ApplicationRecordActions from "./record-actions"
import { CircleX, Eye } from "lucide-react";
import { CircleCorrect } from "@/components/icons";

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
        accessorKey: "email",
        header: "E-mail",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const statusMap = row.getValue('status')
            switch (statusMap) {
                case 1:
                    return <Eye className="text-yellow-500 w-6 h-6" />;
                case 2:
                    return <CircleCorrect className="text-green-500 w-6 h-6" />;
                case 3:
                    return <CircleX className="text-red-500 w-6 h-6" />;
                default:
                    return null;
            }
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ApplicationRecordActions row={row} />,
    },
]
