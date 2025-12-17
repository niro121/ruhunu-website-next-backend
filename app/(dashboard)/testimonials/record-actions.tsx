import React, { useState } from "react"
import { Row } from "@tanstack/react-table"
import { useToast } from "@/components/hooks/use-toast"
import { DataTableRowActions } from "@/components/common/custom-table-row-actions"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import CustomAlertDialog from "@/components/common/custom-alert-dialog"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Testimonial } from "@/types/testimonial"
import { deleteSingleTestimonial } from "@/app/actions/testimonials.actions"


interface TestimonialActionsProps<TData extends Testimonial> {
    row: Row<TData>
}

const TestimonialRecordActions = <TData extends Testimonial>({
    row,
}: TestimonialActionsProps<TData>) => {
    const [showDeleteConfirmation, setShowDelConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const router = useRouter()

    const testimonial = row.original

    const showHideDeleteModal = (value: boolean) => {
        setShowDelConfirmation(value)
    }

    const onDeleteConfirmation = async () => {
        if (testimonial.id) {
            try {
                setLoading(true)
                await deleteSingleTestimonial(testimonial.id)

                toast({
                    variant: "success",
                    title: "Success",
                    description: "Testimonial was deleted successfully",
                })
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message ?? "Testimonial deletion unsuccessful",
                })
            } finally {
                setLoading(false)
                showHideDeleteModal(false)
            }
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Testimonial ID not found.",
            })
        }
    }

    return (
        <>
            <DataTableRowActions>
                <DropdownMenuItem onClick={() => router.push(`/testimonials/${testimonial.id}`)}>
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
                description="This action cannot be undone. This will permanently delete this testimonial and remove the data from our servers."
                handleContinue={onDeleteConfirmation}
            />
        </>
    )
}

export default TestimonialRecordActions
