import { deleteBranche } from "@/app/actions/branches.actions"
import CustomAlertDialog from "@/components/common/custom-alert-dialog"
import { DataTableRowActions } from "@/components/common/custom-table-row-actions"
import { useToast } from "@/components/hooks/use-toast"
import { Branche } from "@/types/branche"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Row } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface BrancheActionsProps<TData extends Branche> {
    row: Row<TData>
}

const BrancheRecordActions = <TData extends Branche>({
    row,
}: BrancheActionsProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const router = useRouter();

    const branche = row.original

    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value)
    }

    const onDeleteConfirmation = async () => {
        if (branche.id) {
            try {
                setLoading(true)
                await deleteBranche(branche.id)

                toast({
                    variant: "success",
                    title: "Success",
                    description: "Career was deleted successfully",
                })
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message ?? "Career deletion unsuccessful",
                })
            } finally {
                setLoading(false)
                showHideDeleteModal(false)
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Career id not found.",
            })
        }
    }

    return (
        <>
            <DataTableRowActions >
                <DropdownMenuItem onClick={() => router.push(`/branches/${branche.id}`)}>
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
                            career and remove the data from our servers."
                handleContinue={onDeleteConfirmation}
            />
        </>
    )
}

export default BrancheRecordActions