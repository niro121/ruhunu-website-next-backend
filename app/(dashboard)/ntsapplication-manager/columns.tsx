"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { CircleCorrect, CircleX } from "@/components/icons";
import { NtsApplicationManager } from "@/types/ntsapplication-manager";
import NtsApplicationManagerRecordActions from "./record-actions";

// DEFINE THE COLUMNS OF THE NTS APPLICATION TABLE
export const ntsApplicationManagerColumns: ColumnDef<NtsApplicationManager>[] = [
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
      const status = row.getValue("status") as number;
      return status === 1 ? (
        <CircleCorrect className="text-green-500 w-7 h-7" />
      ) : (
        <CircleX className="text-red-500 w-7 h-7" />
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <NtsApplicationManagerRecordActions row={row} />,
  },
];
