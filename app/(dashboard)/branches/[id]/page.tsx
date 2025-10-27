import { fetchBrancheById } from "@/app/actions/branches.actions";
import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Branche } from "@/types/branche";
import { notFound, redirect } from "next/navigation";
import BrancheForm from "../branche-form";

export default async function BrancheEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const branche : Branche | null = await fetchBrancheById(id);
    if (!branche) notFound();

    const nextOrder = await getNextOrder("branche");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Menu And Menu Items</h1>
            </div>
            <BrancheForm branche={branche} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}