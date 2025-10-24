import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Service } from "@/types/service";
import { redirect } from "next/navigation";
import ServiceForm from "../service-form";

export default async function NewServicessPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const services: Service | null = null;
    
    const nextOrder = await getNextOrder("service");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Services</h1>
            </div>
            <ServiceForm service={services} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}