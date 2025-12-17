import { fetchServerSession } from "@/lib/session"
import TestimonialForm from "../testimonials-form"
import { notFound, redirect } from "next/navigation"
import { Testimonial } from "@/types/testimonial"
import { fetchTestimonialById } from "@/app/actions/testimonials.actions"
import { getNextOrder } from "@/lib/utils/totalRecordCount"

export default async function TestimonialEditPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const session = await fetchServerSession()
    if (!session?.user) redirect("/login")

    const sessionRole = (session.user as any)?.role ?? undefined

    const testimonial: Testimonial | null = await fetchTestimonialById(id)
    if (!testimonial) notFound()

    const nextOrder = await getNextOrder("testimonial")

    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Edit Testimonial</h1>
            </div>
            <TestimonialForm testimonial={testimonial} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}
