"use client";

import { CustomDialog } from "@/components/common/custom-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MenuItem } from "@/types/menu-items";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import MenuItemRecordActions from "./menu-item-record-actions";
import MenuItemForm from "./menu-item-form";
import { CircleCorrect, CircleX } from "@/components/icons";
import { getTitleById } from "@/app/actions/menuitem.actions";

// ✅ Small helper component to handle hooks safely
function MenuItemNameCell({
  menu,
  sessionRole,
  currentMenuId,
  onChange,
}: {
  menu: MenuItem;
  sessionRole: string | undefined;
  currentMenuId: string | undefined;
  onChange?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <button
        className="text-blue-600 hover:underline"
        onClick={() => setOpen(true)}
      >
        {menu.title}
      </button>

      <CustomDialog open={open} setOpen={setOpen} title="Edit Menu Item" width="800px">
        <MenuItemForm
          menuItem={menu}
          sessionRole={sessionRole}
          currentMenuId={currentMenuId || ""}
          onChange={onChange}
        />
      </CustomDialog>
    </>
  );
}

// ✅ Main table column definition
export const menuItemColumns = (props?: {
  onChange?: () => void;
  currentMenuId: string | undefined;
  sessionRole: string | undefined;
}): ColumnDef<MenuItem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <MenuItemNameCell
        menu={row.original}
        sessionRole={props?.sessionRole}
        currentMenuId={props?.currentMenuId}
        onChange={props?.onChange}
      />
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ getValue }) => {
      const value = getValue<string>() ?? "";
      return (
        <div
          className="w-[200px] truncate text-ellipsis overflow-hidden"
          title={value} // show full URL on hover
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "parentId",
    header: "Parent",
    cell: ({ getValue }) => {
      const parentId = getValue<string>();
      const [title, setTitle] = useState<string>("Loading...");

      useEffect(() => {
        let isMounted = true;

        if (parentId && parentId !== "none") {
          getTitleById(parentId).then((res) => {
            if (isMounted) setTitle(res?.title ?? parentId);
          });
        } else {
          setTitle("No Parent");
        }

        return () => {
          isMounted = false;
        };
      }, [parentId]);

      return (
        <div
          className="max-w-[200px] truncate overflow-hidden text-ellipsis"
          title={title} // shows full title on hover
        >
          {title}
        </div>
      );
    },
  },
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "visible",
    header: "Visibility",
    cell: ({ row }) => {
        const show = row.getValue('visible')
        return show === true ? (
            <CircleCorrect className="text-green-500 w-7 h-7" />
        ) : (
            <CircleX className="text-red-500 w-7 h-7" />
        )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <MenuItemRecordActions
        row={row}
        onChange={props?.onChange}
        currentMenuId={props?.currentMenuId || ""}
        sessionRole={props?.sessionRole}
      />
    ),
  },
];
