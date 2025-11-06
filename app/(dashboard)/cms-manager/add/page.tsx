import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Page } from "@/types/page";
import { redirect } from "next/navigation";
import PageFormTabs from "../page-form-tabs";

export default async function NewCMSPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const page: Page| null = null;
    
    const nextOrder = await getNextOrder("page");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create New Page</h1>
            </div>
            <PageFormTabs page={page} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}