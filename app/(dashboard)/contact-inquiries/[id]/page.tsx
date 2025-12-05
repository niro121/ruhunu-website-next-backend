import { fetchServerSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { ContactInquiriesManager } from "@/types/contactinquiries";
import ContactRecordActions from "../record-actions";
import { fetchContactInquiryById } from "@/app/actions/contactinquiries.action";
import ContactInquiriesForm from "../contactinquiriesfrom";

export default async function ContactInquiryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Check user authentication
  const session = await fetchServerSession();
  if (!session?.user) redirect("/login");

  const sessionRole = (session.user as any)?.role ?? undefined;

  // Fetch the contact inquiry by ID
  const ContactInquiries : ContactInquiriesManager | null = await fetchContactInquiryById(id);

  if (!ContactRecordActions) notFound();

  // Optional: get next order number for display or tracking
  const nextOrder = await getNextOrder("contactInquiries");

  return (
    <div className="space-y-4 px-8">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">Edit Contact Inquiry</h1>
      </div>
      <ContactInquiriesForm
        contact={ContactInquiries}
        sessionRole={sessionRole}
      />
    </div>
  );
}
