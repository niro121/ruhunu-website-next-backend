"use client"

import { createNewNewsAndEvent, updateNewsAndEvent } from "@/app/actions/news-event.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { NewsAndEvent } from "@/types/news-and-event";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type NewsEventFormProps = {
    newsAndEvent: NewsAndEvent | null;
    sessionRole: string | undefined;
    order: number;
};

const NewsAndEventForm = ({newsAndEvent,sessionRole,order}: NewsEventFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: NewsAndEvent = useMemo(
        () => ({
            id: newsAndEvent?.id ?? "",
            name: newsAndEvent?.name ?? "",
            content: newsAndEvent?.content ?? "",
            image: newsAndEvent?.image ?? "",
            video: newsAndEvent?.video ?? "",
            facebook: newsAndEvent?.facebook ?? "",
            instagram: newsAndEvent?.instagram ?? "",
            twitter: newsAndEvent?.twitter ?? "",
            slug: newsAndEvent?.slug ?? "",
            featured: newsAndEvent?.featured ?? false,
            visibility: newsAndEvent?.visibility ?? false
        }),
        [newsAndEvent]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        name: Yup.string().required("This field is mandatory"),
        visibility: Yup.boolean().required("This field is mandatory"),
    });

    // ========== submit form ==========
    const handleSubmit = async (
        values: NewsAndEvent,
        { resetForm }: FormikHelpers<NewsAndEvent>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: NewsAndEvent = {
                name: values.name,
                content: values.content,
                image: values.image,
                video: values.video,
                facebook: values.facebook,
                instagram: values.instagram,
                twitter: values.twitter,
                slug: values.slug,
                featured: values.featured,
                visibility: values.visibility
            }
    
            let resp: any;
                
            // ========== update record ==========
            if(values.id) {
                resp = await updateNewsAndEvent(values.id, createPayload);
            }
                
            // ========== create new ==========
            else {
                resp = await createNewNewsAndEvent(createPayload as NewsAndEvent);
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
                
            const saved: NewsAndEvent = resp?.data ?? resp;
                
            toast({
                variant: 'success',
                title: values.id ? 'News & Event updated' : 'News & Event created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })
                
            // if save and close
            if (submitType === 'save-close') {
                router.push('/news-and-events');
            } else {
                if (!values.id) {
                    router.push(`/news-and-events/${saved.id}`);
                }
            }
                
            // refresh local form with saved id
            resetForm({ values: { ...values, id: saved.id } });
                
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

                            {/* Content */}
                            <CustomRichTextEditor
                                id="content"
                                placeholder="Content"
                                required
                                value={values.content ?? ""}
                                onChange={(e) => setFieldValue("content", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={errors.content}
                                touched={touched.content}
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

                            {/* Video */}
                            <CustomFormField
                                type="text"
                                id="video"
                                placeholder="Video"
                                value={values.video}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.video}
                                touched={touched.video}
                            />

                            {/* Facebook */}
                            <CustomFormField
                                type="text"
                                id="facebook"
                                placeholder="Facebook"
                                value={values.facebook}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.facebook}
                                touched={touched.facebook}
                            />

                            {/* Instagram */}
                            <CustomFormField
                                type="text"
                                id="instagram"
                                placeholder="Instagram"
                                value={values.instagram}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.instagram}
                                touched={touched.instagram}
                            />

                            {/* Twitter */}
                            <CustomFormField
                                type="text"
                                id="twitter"
                                placeholder="Twitter"
                                value={values.twitter}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.twitter}
                                touched={touched.twitter}
                            />

                            {/* Slug */}
                            <CustomFormField
                                type="text"
                                id="slug"
                                placeholder="Slug Auto Genareted"
                                value={values.slug}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                disabled
                                styleClasses={styleClasses}
                                error={errors.slug}
                                touched={touched.slug}
                            />

                            {/* Featured */}
                            <CustomCheckedField
                                id="featured"
                                placeholder="Featured"
                                required
                                mode="boolean"
                                value={values.featured}
                                onChange={(val) => setFieldValue("featured", val)}
                                onBlur={handleBlur}
                                error={errors.featured as string}
                                touched={touched.featured}
                                styleClasses={styleClasses}
                            />

                            {/* Visibility */}
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
                                onCancelHref="/news-and-events"
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

export default NewsAndEventForm;