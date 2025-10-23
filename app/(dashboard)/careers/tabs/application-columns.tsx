import { Checkbox } from "@/components/ui/checkbox";
import { CareerApplication } from "@/types/careerapplication";
import { ColumnDef } from "@tanstack/react-table";
import CareerApplicationRecordActions from "./application-record-actions";
import { CustomDialog } from "@/components/common/custom-dialog";
import { useState } from "react";
import { useSession } from "next-auth/react";
import CareerApplicationForm from "./application-form";
import { CircleX, Eye } from "lucide-react";
import { CircleCorrect } from "@/components/icons";

// ✅ Small helper component to handle hooks safely
function CareerApplicationNameCell({
    careerApplication,
    sessionRole,
    currentCareerId,
    onChange,
}: {
    careerApplication: CareerApplication;
    sessionRole: string | undefined;
    currentCareerId: string | undefined;
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
                {careerApplication.full_name}
            </button>

            <CustomDialog open={open} setOpen={setOpen} title="Edit Career Application" width="800px">
                <CareerApplicationForm 
                    careerApplication={careerApplication} 
                    sessionRole={sessionRole} 
                    currentCareerId={currentCareerId || ""}
                    onChange={onChange}
                />
            </CustomDialog>
        </>
    );
}

export const careerApplicationColumns = (props?: {
    onChange?: () => void;
    currentCareerId: string | undefined;
    sessionRole: string | undefined;
}): ColumnDef<CareerApplication>[] => [
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
        accessorKey: "full_name",
        header: "Name",
        cell: ({ row }) => (
            <CareerApplicationNameCell
                careerApplication={row.original}
                sessionRole={props?.sessionRole}
                currentCareerId={props?.currentCareerId}
                onChange={props?.onChange}
            />
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "mobile_number",
        header: "Mobile Number",
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
        cell: ({ row }) => (
            <CareerApplicationRecordActions row={row} currentCareerId={props?.currentCareerId} sessionRole={props?.sessionRole} onChange={props?.onChange}  />
        ),
    },
];