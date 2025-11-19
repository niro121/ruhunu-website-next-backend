import { fetchRoomCategoryById } from "@/app/actions/rooms-category.actions";
import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { RoomsCategory } from "@/types/rooms-category";
import { notFound, redirect } from "next/navigation";
import RoomCategoryForm from "../room-categorys-from";

export default async function RoomEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const roomCategory : RoomsCategory | null = await fetchRoomCategoryById(id);
    if (!roomCategory) notFound();

    const nextOrder = await getNextOrder("roomsCategory");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Menu And Menu Items</h1>
            </div>
            <RoomCategoryForm roomCategory={roomCategory} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}