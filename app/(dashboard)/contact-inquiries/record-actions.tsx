"use client";

import React, { useState } from "react";
import { Row } from "@tanstack/react-table";
import { useToast } from "@/components/hooks/use-toast";
import { DataTableRowActions } from "@/components/common/custom-table-row-actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import CustomAlertDialog from "@/components/common/custom-alert-dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ContactInquiriesManager } from "@/types/contactinquiries";
import { deleteContactInquiry } from "@/app/actions/contactinquiries.action";

interface ContactActionsProps<TData extends ContactInquiriesManager> {
  row: Row<TData>;
}

const ContactRecordActions = <TData extends ContactInquiriesManager>({
  row,
}: ContactActionsProps<TData>) => {
  const [showDeleteConfirmation, setShowDelConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();

  const contact = row.original;

  const showHideDeleteModal = (value: boolean) => {
    setShowDelConfirmation(value);
  };

  const onDeleteConfirmation = async () => {
    if (contact.id) {
      try {
        setLoading(true);
        await deleteContactInquiry(contact.id);

        toast({
          variant: "success",
          title: "Deleted successfully",
          description: "The contact inquiry was deleted successfully.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error?.message ?? "Contact inquiry deletion was unsuccessful.",
        });
      } finally {
        setLoading(false);
        showHideDeleteModal(false);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Contact inquiry ID not found.",
      });
    }
  };

  return (
    <>
      <DataTableRowActions>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/contact-inquiries/${contact.id}`)
          }
        >
          View / Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => showHideDeleteModal(true)}>
          Delete
        </DropdownMenuItem>
      </DataTableRowActions>

      <CustomAlertDialog
        open={showDeleteConfirmation}
        handleVisibilityChange={showHideDeleteModal}
        loading={loading}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete this contact inquiry and remove it from our records."
        handleContinue={onDeleteConfirmation}
      />
    </>
  );
};

export default ContactRecordActions;
