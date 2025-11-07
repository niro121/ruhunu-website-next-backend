import { getNextOrder } from "@/lib/utils/totalRecordCount";
import PageFormTabs from "../page-form-tabs";
import { notFound, redirect } from "next/navigation";
import { fetchPageById } from "@/app/actions/page.actions";
import { Page } from "@/types/page";
import { fetchServerSession } from "@/lib/session";

export default async function CMSEditPage (
    { params }: { params: Promise<{ id: string }>}
) {
    const { id } = await params;

    const session = await fetchServerSession();
    if (!session?.user) redirect("/login");

    const sessionRole = (session.user as any)?.role ?? undefined;

    const page : Page | null = await fetchPageById(id);
    if (!page) notFound();

    const nextOrder = await getNextOrder("page");


    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Career And Applications</h1>
            </div>
            <PageFormTabs page={page} sessionRole={sessionRole} order={nextOrder}/>
        </div>
    )
}