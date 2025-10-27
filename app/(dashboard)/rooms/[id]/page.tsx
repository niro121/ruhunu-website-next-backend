import { fetchRoomById } from "@/app/actions/rooms.actions";
import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { Rooms } from "@/types/room";
import { notFound, redirect } from "next/navigation";
import RoomsForm from "../room-from";
import { getAllRoomCategoryNames } from "@/app/actions/rooms-category.actions";

export default async function RoomEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const room : Rooms | null = await fetchRoomById(id);
    if (!room) notFound();

    const nextOrder = await getNextOrder("room");

    const categorys = await getAllRoomCategoryNames();

    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Menu And Menu Items</h1>
            </div>
            <RoomsForm rooms={room} sessionRole={sessionRole} order={nextOrder} categorys={categorys} />
        </div>
    )
}