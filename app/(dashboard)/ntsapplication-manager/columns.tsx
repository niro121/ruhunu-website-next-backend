"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { CircleCorrect, CircleX, Eye } from "@/components/icons";
import { NtsApplicationManager } from "@/types/ntsapplication-manager";
import NtsApplicationManagerRecordActions from "./record-actions";

// DEFINE THE COLUMNS OF THE NTS APPLICATION TABLE
export const ntsApplicationManagerColumns: ColumnDef<NtsApplicationManager>[] =
  [
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
      header: "Full Name",
      cell: ({ row }) => {
        const id = row.original.id;
        const fullName = row.getValue("full_name") as string;

        return (
          <Link
            href={`/ntsapplication-manager/${id}`}
            className="text-blue-600 hover:underline"
          >
            {fullName}
          </Link>
        );
      },
    },

    {
      accessorKey: "date_of_birth",
      header: "Date of Birth",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date_of_birth"));
        return date.toLocaleDateString("en-GB");
      },
    },

    {
      accessorKey: "age",
      header: "Age",
    },

    {
      accessorKey: "gender",
      header: "Gender",
    },

    {
      id: "address",
      header: "Address",
      cell: ({ row }) => {
        const { address1, address2 } = row.original;
        const fullAddress = [address1, address2].filter(Boolean).join(", ");
        return fullAddress || "-";
      },
    },

    {
      accessorKey: "phone",
      header: "Phone",
    },

    {
      accessorKey: "nic",
      header: "NIC",
    },

    {
      accessorKey: "email",
      header: "Email",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusMap = row.getValue("status");
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
      cell: ({ row }) => <NtsApplicationManagerRecordActions row={row} />,
    },
  ];
