"use client"

import { createNewCareer, updateCareer } from "@/app/actions/career.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomDatePickerField from "@/components/common/custom-date-picker-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Career } from "@/types/career";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type CareerFormProps = {
    career: Career | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onCreated: (created: Career) => void;
    onUpdated: (updated: Career) => void;
    order: number;
};

const slugify = (input: string) =>
    input
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const CareersForm = ({
    career,
    sessionRole,
    styleClasses,
    onCreated,
    onUpdated,
    order}: CareerFormProps) => {

    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: Career = useMemo(
        () => ({
            id: career?.id ?? "",
            name: career?.name ?? "",
            slug: career?.slug ?? "",
            short_desc: career?.short_desc ?? "",
            ref_no: career?.ref_no ?? "",
            description: career?.description ?? "",
            image: career?.image ?? "",
            visibility: career?.visibility ?? false,
            order: typeof career?.order === "number" ? career!.order : order,
            no_of_vacancies: typeof career?.no_of_vacancies === "number" ? career!.no_of_vacancies : 1,
            from_date: career?.from_date ? new Date(career.from_date) : new Date(),
            to_date: career?.to_date ? new Date(career.to_date) : new Date(),
        }),
        [career]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        name: Yup.string().required("This field is mandatory"),
        short_desc: Yup.string().required("This field is mandatory"),
        description: Yup.string().required("This field is mandatory"),
        slug: Yup.string().when("id", {
            is: (id: string) => !!id, // only if editing
            then: (schema) => schema.required("This field is mandatory"),
            otherwise: (schema) => schema.notRequired(),
        }),
        visibility: Yup.boolean().required("This field is mandatory"),
        no_of_vacancies: Yup.number().min(1).required(),
        order: Yup.number().min(0).required(),
    });

    // ========== submit form ==========
    const handleSubmit = async (
        values: Career,
        { resetForm }: FormikHelpers<Career>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Career = {
                name: values.name,
                slug: values.slug,
                short_desc: values.short_desc,
                ref_no: values.ref_no,
                description: values.description,
                visibility: values.visibility,
                order: values.order,
                no_of_vacancies: values.no_of_vacancies,
                from_date: values.from_date,
                to_date: values.to_date
            }

            let resp: any;
            
            // ========== update record ==========
            if(values.id) {
                resp = await updateCareer(values.id, createPayload);
            }
                        
            // ========== create new ==========
            else {
                resp = await createNewCareer(createPayload as Career);
            }

            if (resp?.isError) {
                toast({
                    variant: 'destructive',
                    title: 'Save failed',
                    description: values.id
                        ? 'Update failed. Please check the form and try again.'
                        : 'Save failed. Please check the form and try again.'
                });
                setLoading(false);
                return;
            }
                        
            const saved: Career = resp?.data ?? resp;
                        
            toast({
                variant: 'success',
                title: values.id ? 'Docter updated' : 'Docter created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })
                        
            // if save and close
            if (submitType === 'save-close') {
                router.push('/menu-manager');
                return;
            }
            
            if (!values.id) {
                onCreated(saved);
                return;
            } else {
                onUpdated(saved);
            
                // refresh local form with saved id
                resetForm({ values: { ...values, id: saved.id } });
            }
            
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            toast({
                variant: "destructive",
                title: "Save failed",
                description: "Unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
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

                                {/* Slug */}
                                <CustomFormField
                                    type="text"
                                    id="slug"
                                    placeholder="Slug (auto-generated)"
                                    value={values.slug}
                                    onChange={handleChange}
                                    disabled={!values.id}
                                    onBlur={(e: any) => {
                                        setFieldValue("slug", slugify(e.target.value));
                                    }}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.slug}
                                    touched={touched.slug}
                                />

                                {/* ref nume */}
                                <CustomFormField
                                    type="text"
                                    id="ref_no"
                                    required
                                    disabled
                                    placeholder="Reference No (auto-generated)"
                                    value={values.ref_no}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    styleClasses={styleClasses}
                                    error={errors.ref_no}
                                    touched={touched.ref_no}
                                />

                                {/* Short description */}
                                <CustomFormField
                                    type="textarea"
                                    id="short_desc"
                                    required
                                    placeholder="Short description"
                                    value={values.short_desc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    styleClasses={styleClasses}
                                    error={errors.short_desc}
                                    touched={touched.short_desc}
                                />

                                {/* Description */}
                                <CustomRichTextEditor
                                    id="description"
                                    placeholder="Description"
                                    required
                                    value={values.description ?? ""}
                                    onChange={(e) => setFieldValue("description", e.target.value)}
                                    onBlur={handleBlur}
                                    styleClasses={styleClasses}
                                    error={errors.description}
                                    touched={touched.description}
                                />

                                {/* Image */}
                                <ImageInput
                                    id="image"
                                    placeholder="Image"
                                    url={values.image || ''}
                                    setFieldValue={setFieldValue}
                                    fieldName={'image'}
                                    styleClasses={styleClasses}
                                    error={errors.image}
                                    touched={touched.image}
                                    required={false}
                                />

                                {/* Number Of Vacancies */}
                                <CustomFormField
                                    type="number"
                                    id="no_of_vacancies"
                                    placeholder="Numbe Of Vacancies"
                                    value={values.no_of_vacancies ?? 1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.no_of_vacancies}
                                    touched={touched.no_of_vacancies}
                                />

                                {/* Order */}
                                <CustomFormField
                                    type="number"
                                    id="order"
                                    placeholder="Order"
                                    value={values.order ?? order}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                />

                                {/* Is Publish */}
                                <CustomCheckedField
                                    id="visibility"
                                    placeholder="Is Publish?"
                                    required
                                    mode="boolean"
                                    value={values.visibility}
                                    onChange={(val) => setFieldValue("visibility", val)}
                                    onBlur={handleBlur}
                                    error={errors.visibility as string}
                                    touched={touched.visibility}
                                    styleClasses={styleClasses}
                                />

                                {/* From Date */}
                                <CustomDatePickerField
                                    id="from_date"
                                    placeholder="From Date"
                                    required
                                    value={values.from_date}
                                    onChange={(d: any) =>
                                        setFieldValue('from_date', d ?? null)
                                    }
                                    onBlur={handleBlur}
                                    styleClasses={styleClasses}
                                    error={errors.from_date as string}
                                    touched={!!touched.from_date}
                                    captionLayout="dropdown"
                                    fromYear={2025}
                                    toYear={2035}
                                    disablePast
                                />

                                {/* To Date */}
                                <CustomDatePickerField
                                    id="to_date"
                                    placeholder="To Date"
                                    required
                                    value={values.to_date}
                                    onChange={(d: any) =>
                                        setFieldValue('to_date', d ?? null)
                                    }
                                    onBlur={handleBlur}
                                    styleClasses={styleClasses}
                                    error={errors.to_date as string}
                                    touched={!!touched.to_date}
                                    captionLayout="dropdown"
                                    fromYear={2025}
                                    toYear={2035}
                                    disablePast
                                />

                                {/* Save Buttons */}
                                <FormActionsBtns
                                    onCancelHref="/careers"
                                    showSaveAndClose
                                    loading={loading}
                                    disabled={!sessionRole}
                                    onBeforeSubmit={(t) => { submitTypeRef.current = t; }}
                                    onSubmitClick={() => submitForm()}
                                />

                            </div>
                        </Form>
                </Card>
            )}
        </Formik>
    )
}

export default CareersForm;