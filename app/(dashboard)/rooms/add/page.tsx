import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Rooms } from "@/types/room";
import { redirect } from "next/navigation";
import RoomsForm from "../room-from";
import { getAllRoomCategoryNames, getAllRoomCategorys } from "@/app/actions/rooms-category.actions";

export default async function NewRoomsPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const rooms: Rooms | null = null;
    
    const nextOrder = await getNextOrder("room");

    const categorys = await getAllRoomCategoryNames();
     
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Branche</h1>
            </div>
            <RoomsForm rooms={rooms} sessionRole={sessionRole} order={nextOrder} categorys={categorys} />
        </div>
    )
}