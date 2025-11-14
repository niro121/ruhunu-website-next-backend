import { deleteSection } from "@/app/actions/section.actions";
import CustomAlertDialog from "@/components/common/custom-alert-dialog";
import { DataTableRowActions } from "@/components/common/custom-table-row-actions";
import { useToast } from "@/components/hooks/use-toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Section } from "@/types/section";
import { Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ContentActionsProps<TData extends Section> {
    row: Row<TData>
}

const ContentRecordAction = <TData extends Section> ({
    row,
}: ContentActionsProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const router = useRouter();
    
    const section = row.original
    
    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value)
    }

    const onDeleteConfirmation = async () => {
        if (section.id) {
            try {
                setLoading(true)
                await deleteSection(section.id)
    
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Section was deleted successfully",
                })
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message ?? "Section deletion unsuccessful",
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
                {/* <DropdownMenuItem onClick={() => router.push(`/cms-manager/${section.id}`)}>
                    Edit
                </DropdownMenuItem> */}
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
                            section and remove the data from our servers."
                handleContinue={onDeleteConfirmation}
            />
        </>
    )
}

export default ContentRecordAction;