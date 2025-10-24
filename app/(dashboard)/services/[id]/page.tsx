import { fetchServiceById } from "@/app/actions/service.actions";
import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Service } from "@/types/service";
import { notFound, redirect } from "next/navigation";
import ServiceForm from "../service-form";

export default async function ServiceEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const services : Service | null = await fetchServiceById(id);
    if (!services) notFound();

    const nextOrder = await getNextOrder("service");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Menu And Menu Items</h1>
            </div>
            <ServiceForm service={services} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}