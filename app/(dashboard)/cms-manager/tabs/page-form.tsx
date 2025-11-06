"use client"

import { createNewPage, updatePage } from "@/app/actions/page.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Page } from "@/types/page";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type PageFormProps = {
    page: Page | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onCreated: (created: Page) => void;
    onUpdated: (updated: Page) => void;
    order: number;
}

const slugify = (input: string) =>
    input
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const PageForm = ({
    page,
    sessionRole,
    styleClasses,
    onCreated,
    onUpdated,
    order}: PageFormProps) => {

    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: Page = useMemo(
        () => ({
            id: page?.id ?? "",
            title: page?.title ?? "",
            metaTitle: page?.metaTitle ?? "",
            metaKeyword: page?.metaKeyword ?? "",
            metaDescription: page?.metaDescription ?? "",
            metaImage: page?.metaImage ?? "",
            slug: page?.slug ?? "",
            visibility: page?.visibility ?? false
        }),
        [page]
    )

    // ========== form validation ==========
    const validationSchema = Yup.object({

    })

    // ========== submit form ==========
    const handleSubmit = async (
        values: Page,
        { resetForm }: FormikHelpers<Page>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Page = {
                title: values.title,
                metaTitle: values.metaTitle,
                metaKeyword: values.metaKeyword,
                metaDescription: values.metaDescription,
                metaImage: values.metaImage,
                slug: values.slug,
                visibility: values.visibility
            }

            let resp: any;
                        
            // ========== update record ==========
            if(values.id) {
                resp = await updatePage(values.id, createPayload);
            }
                                    
            // ========== create new ==========
            else {
                resp = await createNewPage(createPayload as Page);
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
                                    
            const saved: Page = resp?.data ?? resp;
                                    
            toast({
                variant: 'success',
                title: values.id ? 'Docter updated' : 'Docter created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })

            // if save and close
            if (submitType === 'save-close') {
                router.push('/cms-manager');
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

                            {/* Title */}
                            <CustomFormField
                                type="text"
                                id="title"
                                placeholder="Title"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.title}
                                touched={touched.title}
                            />

                            {/* Meta Title */}
                            <CustomFormField
                                type="text"
                                id="metaTitle"
                                placeholder="Meta Title"
                                value={values.metaTitle}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.metaTitle}
                                touched={touched.metaTitle}
                            />

                            {/* Meta Keywrod */}
                            <CustomFormField
                                type="text"
                                id="metaKeyword"
                                placeholder="Meta Keyword"
                                value={values.metaKeyword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.metaKeyword}
                                touched={touched.metaKeyword}
                            />

                            {/* Meta Description */}
                            <CustomRichTextEditor
                                id="metaDescription"
                                placeholder="Meta Description"
                                required
                                value={values.metaDescription ?? ""}
                                onChange={(e) => setFieldValue("metaDescription", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={errors.metaDescription}
                                touched={touched.metaDescription}
                            />

                            {/* Meta Image */}
                            <ImageInput
                                id="metaImage"
                                placeholder="Meta Image"
                                url={values.metaImage || ''}
                                setFieldValue={setFieldValue}
                                fieldName={'metaImage'}
                                styleClasses={styleClasses}
                                error={errors.metaImage}
                                touched={touched.metaImage}
                                required={false}
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

                            {/* Save Buttons */}
                            <FormActionsBtns
                                onCancelHref="/cms-manager"
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

export default PageForm;