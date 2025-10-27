import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Branche } from "@/types/branche";
import { redirect } from "next/navigation";
import BrancheForm from "../branche-form";

export default async function NewBranchesPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const branches: Branche | null = null;
    
    const nextOrder = await getNextOrder("branche");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Branche</h1>
            </div>
            <BrancheForm branche={branches} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}