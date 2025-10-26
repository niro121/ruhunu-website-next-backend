import { fetchServerSession } from "@/lib/session";
import { getNextOrder } from "@/lib/utils/totalRecordCount";
import { NewsAndEvent } from "@/types/news-and-event";
import { redirect } from "next/navigation";
import NewsAndEventForm from "../news-and-event-form";

export default async function NewNewsEventsPage() {
    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");
    
    const sessionRole = (session.user as any)?.role ?? undefined;
    
    const newsAndEvents: NewsAndEvent | null = null;
    
    const nextOrder = await getNextOrder("newsAndEvents");
    
    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create News & Event</h1>
            </div>
            <NewsAndEventForm newsAndEvent={newsAndEvents} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}