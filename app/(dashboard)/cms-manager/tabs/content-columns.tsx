import { CustomDialog } from "@/components/common/custom-dialog";
import { CircleCorrect, CircleX } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Section } from "@/types/section";
import { ColumnDef } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ContentRecordAction from "./content-record-actions";

function ContentColumnsTitleCell({
    content,
    sessionRole,
    currentPageId,
    onChange
}: {
    content: Section;
    sessionRole: string | undefined;
    currentPageId: string | undefined;
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
                {content.type}
            </button>

            <CustomDialog open={open} setOpen={setOpen} title="Edit Career Application" width="800px">
                <></>
            </CustomDialog>
        </>
    );
}

export const contentColumns = (props?: {
    onChange?: () => void;
    currentPageId: string | undefined;
    sessionRole: string | undefined;
}): ColumnDef<Section>[] => [
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
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <ContentColumnsTitleCell
                content={row.original}
                sessionRole={props?.sessionRole}
                currentPageId={props?.currentPageId}
                onChange={props?.onChange}
            />
        ),
    },
    {
        accessorKey: "data.title",
        header: "Title",
    },
    {
        accessorKey: "order",
        header: "Order",
    },
    {
        accessorKey: "layout",
        header: "Layout",
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
        cell: ({ row }) => <ContentRecordAction row={row} />
    }
]