import { deleteNewsLetter } from "@/app/actions/news-letter.actions"
import CustomAlertDialog from "@/components/common/custom-alert-dialog"
import { DataTableRowActions } from "@/components/common/custom-table-row-actions"
import { useToast } from "@/components/hooks/use-toast"
import { NewsLetter } from "@/types/news-letter"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Row } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import { useState } from "react"

interface NewsLetterActionsProps<TData extends NewsLetter> {
    row: Row<TData>
}

const SubcriptionRecordActions = <TData extends NewsLetter>({
    row,
}: NewsLetterActionsProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()

    const newsLetter = row.original

    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value)
    }

    const onDeleteConfirmation = async () => {
        if (newsLetter.id) {
            try {
                setLoading(true)
                await deleteNewsLetter(newsLetter.id)

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

export default SubcriptionRecordActions