import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Center } from "@/types/center";
import { redirect } from "next/navigation";
import CenterForm from "../center-form";

export default async function NewCenterPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const center: Center| null = null;
    
    const nextOrder = await getNextOrder("collectingCenter");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Collecting Center</h1>
            </div>
            <CenterForm center={center} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}