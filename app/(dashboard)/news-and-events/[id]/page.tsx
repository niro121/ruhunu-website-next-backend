import { fetchNewsAndEventById } from "@/app/actions/news-event.actions";
import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { NewsAndEvent } from "@/types/news-and-event";
import { notFound, redirect } from "next/navigation";
import NewsAndEventForm from "../news-and-event-form";

export default async function NewsEventsEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const newsAndEvent : NewsAndEvent | null = await fetchNewsAndEventById(id);
    if (!newsAndEvent) notFound();

    const nextOrder = await getNextOrder("newsAndEvents");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit News & Event</h1>
            </div>
            <NewsAndEventForm newsAndEvent={newsAndEvent} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}