import { fetchCenterById } from "@/app/actions/center.actions";
import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Center } from "@/types/center";
import { notFound, redirect } from "next/navigation";
import CenterForm from "../center-form";

export default async function CenterEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const center : Center | null = await fetchCenterById(id);
    if (!center) notFound();

    const nextOrder = await getNextOrder("collectingCenter");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Collecting Center</h1>
            </div>
            <CenterForm center={center} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}