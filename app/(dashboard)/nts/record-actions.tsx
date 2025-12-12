import React, { useState } from "react"
import { Row } from "@tanstack/react-table"
import { useToast } from "@/components/hooks/use-toast"
import { DataTableRowActions } from "@/components/common/custom-table-row-actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import CustomAlertDialog from "@/components/common/custom-alert-dialog"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { NtsApplication } from "@/types/ntsapplication"
import { deleteApplication } from "@/app/actions/nts-application.actions"

interface ApplicationActionsProps<TData extends NtsApplication> {
    row: Row<TData>
}

const ApplicationRecordActions = <TData extends NtsApplication>({
    row,
}: ApplicationActionsProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const router = useRouter();

    const nts = row.original

    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value)
    }

    const onDeleteConfirmation = async () => {
        if (nts.id) {
            try {
                setLoading(true)
                await deleteApplication(nts.id)

                toast({
                    variant: "success",
                    title: "Success",
                    description: "Application was deleted successfully",
                })
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message ?? "Application deletion unsuccessful",
                })
            } finally {
                setLoading(false)
                showHideDeleteModal(false)
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Application ID not found.",
            })
        }
    }

    return (
        <>
            <DataTableRowActions >
                <DropdownMenuItem onClick={() => router.push(`/nts/${nts.id}`)}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => showHideDeleteModal(true)}>
                    Delete
                </DropdownMenuItem>
            </DataTableRowActions>

            <CustomAlertDialog
                open={showDeleteConfirmation}
                handleVisibilityChange={showHideDeleteModal}
                loading={loading}
                title="Are you absolutely sure?"
                description="This action cannot be undone. This will permanently delete this
                            application and remove the data from our servers."
                handleContinue={onDeleteConfirmation}
            />
        </>
    )
}

export default ApplicationRecordActions