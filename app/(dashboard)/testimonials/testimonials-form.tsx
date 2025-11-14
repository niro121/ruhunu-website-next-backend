"use client"

import { createNewTestimonial, updateTestimonial } from "@/app/actions/testimonials.actions"
import CustomCheckedField from "@/components/common/custom-checked-field"
import CustomSelectField from "@/components/common/custom-select-field"
import { FormActionsBtns } from "@/components/common/form-actions-btns"
import CustomFormField from "@/components/common/form-field"
import { useToast } from "@/components/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { Testimonial } from "@/types/testimonial"
import { Form, Formik, FormikHelpers } from "formik"
import { useRouter } from "next/navigation"
import React, { useMemo } from "react"
import * as Yup from "yup"

type TestimonialFormProps = {
    testimonial: Testimonial | null
    sessionRole: string | undefined
    order?: number 
}

const TestimonialForm = ({ testimonial, sessionRole }: TestimonialFormProps) => {
    const [loading, setLoading] = React.useState(false)
    const { toast } = useToast()
    const router = useRouter()
    const submitTypeRef = React.useRef<"save" | "save-close">("save")

    const initialValues: Testimonial = useMemo(
        () => ({
            id: testimonial?.id ?? "",
            name: testimonial?.name ?? "",
            designation: testimonial?.designation ?? "",
            testimonial: testimonial?.testimonial ?? "",
            rating: testimonial?.rating ?? 0,
            visibility: testimonial?.visibility ?? false,
            createdBy: testimonial?.createdBy ?? null,
            updatedBy: testimonial?.updatedBy ?? null,
        }),
        [testimonial]
    )

    // ========== form validation ==========
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        designation: Yup.string().required("Designation is required"),
        testimonial: Yup.string().required("Testimonial text is required"),
        rating: Yup.number()
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot exceed 5")
            .required("Rating is required"),
        visibility: Yup.boolean().required("This field is mandatory"),
    })

    // ========== submit form ==========
    const handleSubmit = async (
        values: Testimonial,
        { resetForm }: FormikHelpers<Testimonial>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true)
        try {
            const payload: Testimonial = {
                name: values.name,
                designation: values.designation,
                testimonial: values.testimonial,
                rating: values.rating,
                visibility: values.visibility,
                createdBy: values.createdBy,
                updatedBy: values.updatedBy,
            }

            let resp: any

            // ========== update record ==========
            if (values.id) {
                resp = await updateTestimonial(values.id, payload)
            }
            // ========== create new ==========
            else {
                resp = await createNewTestimonial(payload as Testimonial)
            }

            if (resp?.isError) {
                toast({
                    variant: "destructive",
                    title: "Save failed",
                    description: values.id
                        ? "Update failed. Please check the form and try again."
                        : "Save failed. Please check the form and try again.",
                })
                setLoading(false)
                return
            }

            const saved: Testimonial = resp?.data ?? resp

            toast({
                variant: "success",
                title: values.id ? "Testimonial updated" : "Testimonial created",
                description: values.id
                    ? "Changes updated successfully."
                    : "Changes saved successfully.",
            })

            // if save and close
            if (submitType === "save-close") {
                router.push("/testimonials")
            } else {
                if (!values.id) {
                    router.push(`/testimonials/${saved.id}`)
                }
            }

            // refresh local form with saved id
            resetForm({ values: { ...values, id: saved.id } })
        } catch (error: any) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Save failed",
                description: "Unexpected error occurred.",
            })
        } finally {
            setLoading(false)
        }
    }

    const styleClasses = {
        parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
        labelClassName: "text-sm text-black font-semibold capitalize",
        inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, helpers) =>
                handleSubmit(values, helpers, submitTypeRef.current)
            }
        >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
                <Card className="border shadow-sm">
                    {/* FORM START */}
                    <Form className="w-full">
                        <div className="grid gap-4 py-4">

                            {/* Name */}
                            <CustomFormField
                                type="text"
                                id="name"
                                placeholder="Name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.name}
                                touched={touched.name}
                            />

                            {/* Designation */}
                            <CustomFormField
                                type="text"
                                id="designation"
                                placeholder="Designation"
                                value={values.designation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.designation}
                                touched={touched.designation}
                            />

                            {/* Testimonial Text */}
                            <CustomFormField
                                type="textarea"
                                id="testimonial"
                                placeholder="Testimonial"
                                value={values.testimonial}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.testimonial}
                                touched={touched.testimonial}
                            />

                            {/* Rating */}
                            <CustomSelectField
                                id="rating"
                                placeholder="Rating (1–5)"
                                required
                                value={values.rating}
                                onChange={(v) => setFieldValue("rating", v)}
                                onBlur={handleBlur}
                                options={[
                                    { label: "1", value: 1 },
                                    { label: "2", value: 2 },
                                    { label: "3", value: 3 },
                                    { label: "4", value: 4 },
                                    { label: "5", value: 5 },
                                ]}
                                styleClasses={styleClasses}
                                error={errors.rating}
                                touched={touched.rating}
                            />


                            {/* Visibility */}
                            <CustomCheckedField
                                id="visibility"
                                placeholder="Visible to public?"
                                required
                                mode="boolean"
                                value={values.visibility}
                                onChange={(val) => setFieldValue("visibility", val)}
                                onBlur={handleBlur}
                                error={errors.visibility as string}
                                touched={touched.visibility}
                                styleClasses={styleClasses}
                            />

                            {/* Save Buttons */}
                            <FormActionsBtns
                                onCancelHref="/testimonials"
                                showSaveAndClose
                                loading={loading}
                                disabled={!sessionRole}
                                onBeforeSubmit={(t) => {
                                    submitTypeRef.current = t
                                }}
                                onSubmitClick={() => submitForm()}
                            />
                        </div>
                    </Form>
                </Card>
            )}
        </Formik>
    )
}

export default TestimonialForm
