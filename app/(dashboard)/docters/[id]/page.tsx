import { fetchServerSession } from "@/lib/session";
import DocterForm from "../docter-form";
import { notFound, redirect } from "next/navigation";
import { Docter } from "@/types/docter";
import { fetchDocterById } from "@/app/actions/docter.actions";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { getAllBranchesToDocter } from "@/app/actions/branches.actions";
import { getAllSpecialitysToDocter } from "@/app/actions/speciality.actions";

export default async function DocterEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const docter : Docter | null = await fetchDocterById(id);
    if (!docter) notFound();

    const nextOrder = await getNextOrder("docter");

    const branches = await getAllBranchesToDocter();

    const specialitis = await getAllSpecialitysToDocter();

    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Menu And Menu Items</h1>
            </div>
            <DocterForm docter={docter} sessionRole={sessionRole} order={nextOrder} branches={branches} specialitis={specialitis} />
        </div>
    )
}