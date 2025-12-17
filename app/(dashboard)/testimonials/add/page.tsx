import { fetchServerSession } from "@/lib/session"
import { Testimonial } from "@/types/testimonial"
import { redirect } from "next/navigation"
import TestimonialForm from "../testimonials-form"
import { getNextOrder } from "@/lib/utils/totalRecordCount"

export default async function NewTestimonialsPage() {
    const session = await fetchServerSession()
    if (!session?.user) redirect("/login")

    const sessionRole = (session.user as any)?.role ?? undefined

    const testimonial: Testimonial | null = null

    const nextOrder = await getNextOrder("testimonial")

    return (
        <div className="space-y-4 px-8">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold">Create Testimonial</h1>
            </div>

            {/* Form */}
            <TestimonialForm testimonial={testimonial} sessionRole={sessionRole} order={nextOrder} />
        </div>
    )
}
