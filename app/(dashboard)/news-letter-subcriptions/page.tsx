import { fetchServerSession } from "@/lib/session";
import { SearchInput } from "../search";
import { Suspense } from "react";
import Loading from "../loading";
import { CustomDataTable } from "@/components/common/custom-data-table";
import { subcriptionColumns } from "./columns";
import { bulkDeleteNewsLetters, getAllNewsLetters } from "@/app/actions/news-letter.actions";

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
    
    const { data, totalRecords } = await getAllNewsLetters({
        page: resolvedSearchParams?.page,
        limit: resolvedSearchParams?.limit,
        keyword: resolvedSearchParams?.keyword,
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
                        heading="Subcriptions"
                        subHeading="Manage your subcriptions here."
                        columns={subcriptionColumns}
                        data={data}
                        rowCount={totalRecords}
                        deleteServerAction={bulkDeleteNewsLetters}
                        page={resolvedSearchParams?.page}
                    />
                </Suspense>
            </div>
        </>
    )
}