import { fetchServerSession } from "@/lib/session"
import { SearchInput } from "../search"
import Loading from "../loading"
import AddNewLinkButton from "@/components/common/add-new-link-btn"
import { Suspense } from "react"
import { CustomDataTable } from "@/components/common/custom-data-table"
import { bulkDeleteTestimonials, getAllTestimonials } from "@/app/actions/testimonials.actions"
import { testimonialColumns } from "./columns"

type SearchParams = {
    searchParams?: Promise<{
        page?: string
        limit?: string
        keyword?: string
    }>
}

export default async function TestimonialsPage({ searchParams }: SearchParams) {
    const resolvedSearchParams = await searchParams
    const session = await fetchServerSession()

    const { data, totalRecords } = await getAllTestimonials({
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
                            placeholder="Search by name, designation"
                            className="rounded-lg bg-background pl-8 w-full sm:w-auto"
                        />
                    </div>
                    <AddNewLinkButton href="/testimonials/add" />
                </div>
            </div>

            <div className="lg:hidden mt-2 relative flex-1 md:grow-0">
                <SearchInput
                    name="keyword"
                    placeholder="Search by name, designation"
                    className="rounded-lg bg-background pl-8 w-full"
                />
            </div>

            <div className="overflow-hidden">
                <Suspense fallback={<Loading />}>
                    <CustomDataTable
                        heading="Testimonials"
                        subHeading="Manage your testimonials here."
                        columns={testimonialColumns}
                        data={data}
                        rowCount={totalRecords}
                        deleteServerAction={bulkDeleteTestimonials}
                        page={resolvedSearchParams?.page}
                    />
                </Suspense>
            </div>
        </>
    )
}
