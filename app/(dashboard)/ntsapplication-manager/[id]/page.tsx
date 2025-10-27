import { fetchServerSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { fetchApplicationById } from "@/app/actions/ntsapplication.actions";
import { getNextOrder } from "@/lib/utils/totalRecordCount"
import NtsApplicationManagerRecordActions from "../record-actions";
import NtsApplicationForm from "../ntsapplicationform";
import { NtsApplicationManager } from "@/types/ntsapplication-manager";

export default async function NtsApplicationEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const applications : NtsApplicationManager | null = await fetchApplicationById(id);

    if (!NtsApplicationManagerRecordActions) notFound();

    const nextOrder = await getNextOrder("ntsApplication");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Menu And Menu Items</h1>
            </div>
            <NtsApplicationForm application={applications} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}
