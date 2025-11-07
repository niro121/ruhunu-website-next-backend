import { fetchServerSession } from "@/lib/session";
import { SearchInput } from "../search";
import AddNewLinkButton from "@/components/common/add-new-link-btn";
import { Suspense } from "react";
import { CustomDataTable } from "@/components/common/custom-data-table";
import Loading from "../loading";
import { bulkDeletePages, getAllPages } from "@/app/actions/page.actions";
import { pagesColumns } from "./columns";

type SearchParams = {
    searchParams?: Promise<{
        page?: string;
        limit?: string;
        keyword?: string;
    }>
}

export default async function Page( {searchParams} : SearchParams ) {

    const resolvedSearchParams = await searchParams;
    const session = await fetchServerSession()
    
    const { data, totalRecords } = await getAllPages({
        page: resolvedSearchParams?.page,
        limit: resolvedSearchParams?.limit,
        keyword: resolvedSearchParams?.keyword,
        role: session?.user?.role ?? ""
    })

    return (
        <>
            <div className="flex items-center ">
                <div className="ml-auto flex items-center gap-4">
                    <div className="lg:block hidden relative flex-1 md:grow-0">
                        <SearchInput
                            name="keyword"
                            placeholder={"Search by name, email"}
                            className={"rounded-lg bg-background pl-8 w-full sm:w-auto"}
                        />
                    </div>
                    <AddNewLinkButton href="/cms-manager/add" />
                </div>
            </div>
            <div className="lg:hidden mt-2 relative flex-1 md:grow-0">
                <SearchInput
                    name="keyword"
                    placeholder={"Search by name, email"}
                    className={"rounded-lg bg-background pl-8 w-full"}
                />
            </div>
            <div className="overflow-hidden">
                <Suspense fallback={<Loading />}>
                    <CustomDataTable
                        heading="Pages"
                        subHeading="Manage your pages here."
                        columns={pagesColumns}
                        data={data}
                        rowCount={totalRecords}
                        deleteServerAction={bulkDeletePages}
                        page={resolvedSearchParams?.page}
                    />
                </Suspense>
            </div>
        </>
    )
}