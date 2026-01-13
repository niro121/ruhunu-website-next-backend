import { fetchSpecialityById } from "@/app/actions/speciality.actions";
import SpecialityForm from "../speciality-form";
import { fetchServerSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { Speciality } from "@/types/speciality";
import { getNextOrder } from "@/lib/utils/totalRecordCount";

export default async function SpecialityEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const speciality : Speciality | null = await fetchSpecialityById(id);
    if (!speciality) notFound();
    
    const nextOrder = await getNextOrder("speciality");
    
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Menu And Menu Items</h1>
            </div>
            <SpecialityForm speciality={speciality} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}