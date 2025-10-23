"use client";

import { deleteCareerApplication } from "@/app/actions/career-application.actions";
import CustomAlertDialog from "@/components/common/custom-alert-dialog";
import { CustomDialog } from "@/components/common/custom-dialog";
import { DataTableRowActions } from "@/components/common/custom-table-row-actions";
import { useToast } from "@/components/hooks/use-toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CareerApplication } from "@/types/careerapplication";
import { Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface CareerApplicationRecordActionsProps<TData extends CareerApplication> {
    row: Row<TData>;
    onChange?: () => void;
    currentCareerId: string | undefined,
    sessionRole: string | undefined,
}

const CareerApplicationRecordActions = <TData extends CareerApplication> ({
    row,
    onChange
}: CareerApplicationRecordActionsProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { data: session } = useSession();

    const application = row.original;

    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value);
    };

    const onDeleteConfirmation = async () => {
        if (!application.id) return;
        try {
            setLoading(true);
            await deleteCareerApplication(application.id);
            toast({ variant: "success", title: "Deleted", description: "Menu Item deleted successfully" });
            if (onChange) onChange();
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err?.message || "Failed to delete" });
        } finally {
            setLoading(false);
            showHideDeleteModal(false);
        }
    };

    return (
        <>
            <DataTableRowActions>
                <DropdownMenuItem onClick={() => setShowViewDialog(true)}>View / Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => showHideDeleteModal(true)}>Delete</DropdownMenuItem>
            </DataTableRowActions>

            <CustomAlertDialog
                open={showDeleteConfirmation}
                handleVisibilityChange={showHideDeleteModal}
                loading={loading}
                title="Are you sure?"
                description="This action cannot be undone."
                handleContinue={onDeleteConfirmation}
            />

            <CustomDialog open={showViewDialog} setOpen={setShowViewDialog} title="Edit Career Application" width="800px">
                <></>
            </CustomDialog>
        </>
    );
}

export default CareerApplicationRecordActions;