"use client"
import React, { useState } from "react"
import { Row } from "@tanstack/react-table"
import { useToast } from "@/components/hooks/use-toast"
import { DataTableRowActions } from "@/components/common/custom-table-row-actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import CustomAlertDialog from "@/components/common/custom-alert-dialog"
import { useSession } from "next-auth/react"
import { deleteDocter } from "@/app/actions/docter.actions"
import { NtsApplicationManager } from "@/types/ntsapplication-manager"
import { useRouter } from "next/navigation"


interface NtsApplicationProps<TData extends NtsApplicationManager> {
    row: Row<TData>
}

const NtsApplicationManagerRecordActions = <TData extends NtsApplicationManager>({
    row,
}: NtsApplicationProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const router = useRouter();

    const application = row.original

    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value)
    }

    const onDeleteConfirmation = async () => {
        if (application.id) {
            try {
                setLoading(true)
                await deleteDocter(application.id)

                toast({
                    variant: "success",
                    title: "Success",
                    description: "Nts Application deleted successfully",
                })
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message ?? "Nts Application unsuccessful",
                })
            } finally {
                setLoading(false)
                showHideDeleteModal(false)
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Application id not found.",
            })
        }
    }

    return (
        <>
            <DataTableRowActions >
                <DropdownMenuItem onClick={() => router.push(`/ntsapplication-manager/${application.id}`)}>
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

export default NtsApplicationManagerRecordActions;