import { fetchServerSession } from "@/lib/session";
import { NtsApplication } from "@/types/ntsapplication";
import { redirect } from "next/navigation";
import ApplicationForm from "../application-form";
import { getNextOrder } from "@/lib/utils/totalRecordCount";

export default async function NewApplicationsPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const docters: NtsApplication | null = null;
    
    const nextOrder = await getNextOrder("docter");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Application Data</h1>
            </div>
            <ApplicationForm application={docters} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}