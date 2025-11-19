import React, { useState } from "react"
import { Row } from "@tanstack/react-table"
import { useToast } from "@/components/hooks/use-toast"
import { DataTableRowActions } from "@/components/common/custom-table-row-actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import CustomAlertDialog from "@/components/common/custom-alert-dialog"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { deleteService } from "@/app/actions/service.actions"
import { Rooms } from "@/types/room"
import { deleteRoom } from "@/app/actions/rooms.actions"

interface RoomsActionsProps<TData extends Rooms> {
    row: Row<TData>
}

const RoomsRecordActions = <TData extends Rooms>({
    row,
}: RoomsActionsProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const router = useRouter();

    const rooms = row.original

    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value)
    }

    const onDeleteConfirmation = async () => {
        if (rooms.id) {
            try {
                setLoading(true)
                await deleteRoom(rooms.id)

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
                <DropdownMenuItem onClick={() => router.push(`/Roomss/${rooms.id}`)}>
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

export default RoomsRecordActions