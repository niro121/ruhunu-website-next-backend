import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { RoomsCategory } from "@/types/rooms-category";
import { redirect } from "next/navigation";
import RoomCategoryForm from "../room-categorys-from";

export default async function NewRoomsPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const roomCategory: RoomsCategory | null = null;
    
    const nextOrder = await getNextOrder("roomsCategory");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Branche</h1>
            </div>
            <RoomCategoryForm roomCategory={roomCategory} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}