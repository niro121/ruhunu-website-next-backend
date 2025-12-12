import { fetchServerSession } from "@/lib/session";
import ApplicationForm from "../application-form";
import { notFound, redirect } from "next/navigation";
import { fetchApplicationById } from "@/app/actions/nts-application.actions";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { NtsApplication } from "@/types/ntsapplication";

export default async function DocterEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const docter : NtsApplication | null = await fetchApplicationById(id);
    if (!docter) notFound();

    const nextOrder = await getNextOrder("docter");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Menu And Menu Items</h1>
            </div>
            <ApplicationForm application={docter} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}