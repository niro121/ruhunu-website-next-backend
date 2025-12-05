"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CircleCorrect, CircleX, Eye } from "@/components/icons";
import Link from "next/link";
import { ContactInquiriesManager } from "@/types/contactinquiries";
import ContactRecordActions from "./record-actions";

// DEFINE THE COLUMNS OF THE CONTACT INQUIRIES TABLE
export const contactColumns: ColumnDef<ContactInquiriesManager>[] = [
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
        className="translate-y-0.5px"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5px"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const id = row.original.id;
      const name = row.getValue("name") as string;

      return (
        <Link
          href={`/contact-inquiries/${id}`}
          className="text-blue-600 hover:underline"
        >
          {name}
        </Link>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.getValue("phone") as string,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email") as string,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      return (
        <div className="max-w-xs truncate" title={message}>
          {message}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;

      return status ? (
        <CircleCorrect className="text-green-500 w-7 h-7" />
      ) : (
        <Eye className="text-yellow-500 w-6 h-6" />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ContactRecordActions row={row} />,
  },
];
