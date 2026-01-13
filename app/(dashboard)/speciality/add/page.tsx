import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Speciality } from "@/types/speciality";
import { redirect } from "next/navigation";
import SpecialityForm from "../speciality-form";

export default async function NewSpecialityPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
        
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const speciality: Speciality | null = null;

    const nextOrder = await getNextOrder("speciality");

    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Branche</h1>
            </div>
            <SpecialityForm speciality={speciality} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}