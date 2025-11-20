"use client"

import { createNewSection, getNextOrder, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section";
import { Form, Formik, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import * as Yup from "yup";

type MediaOnlySection = Omit<Section, ""> & {
    data: {
        title: string;
        subTitle: string;
        image: string;
        mobileImage: string;
        video: string;
        mobileVideo: string;
        externalVideoUrl: string;
        paddingtop: number;
        paddingbottom: number;
    }
}

type MediaOnlyProps = {
    pageId: string | null;
    content: MediaOnlySection | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const MediaOnlyForm = ({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: MediaOnlyProps) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");
    const [nextOrder, setNextOrder] = useState<number>(1); 
                
    useEffect(() => {    
        const fetchOrder = async () => {
            try {
                const order = await getNextOrder(pageId || '');
                setNextOrder(order);
            } catch (error) {
                console.error("Error fetching next order:", error);
            }
        };
        if (!content && pageId) fetchOrder();
    }, [content, pageId]);
    
    // Initial Values
    const initialValues: MediaOnlySection = useMemo(
        () => ({
            id: content?.id || "",
            type: "Text-Media",
            layout: content?.layout || 1,
            order: content?.order || nextOrder,
            data: {
                title:content?.data.title || "",
                subTitle:content?.data.subTitle || "",
                image:content?.data.image || "",
                mobileImage:content?.data.mobileImage || "",
                video:content?.data.video || "",
                mobileVideo:content?.data.mobileVideo || "",
                externalVideoUrl:content?.data.externalVideoUrl || "",
                paddingtop:content?.data.paddingtop || 0,
                paddingbottom:content?.data.paddingbottom || 0,
            },
            pageId: pageId || "",
            visibility: content?.visibility || false,
        }),[content,nextOrder]
    );
    
    // Validation Schema
    const validationSchema = Yup.object({
        data: Yup.object({
            title: Yup.string().required("Title is required"),
            webImage: Yup.string().required("Title is required"),
            mobileImage: Yup.string().required("Title is required"),
        }),
        order: Yup.number().required("Order is required"),
    });
    
        // Submit
        const handleSubmit = async (
            values: MediaOnlySection,
            { resetForm }: FormikHelpers<MediaOnlySection>,
            submitType: "save" | "save-close" = "save"
        ) => {
            setLoading(true);
        
            try {
                const createPayload: Section = {
                    type: values.type,
                    layout: values.layout,
                    order: values.order,
                    data: {
                        title: values.data.title,
                        subTitle: values.data.subTitle,
                        image: values.data.image,
                        mobileImage: values.data.mobileImage,
                        video: values.data.video,
                        mobileVideo: values.data.mobileVideo,
                        externalVideoUrl: values.data.externalVideoUrl,
                        paddingtop: values.data.paddingtop,
                        paddingbottem: values.data.paddingbottom,
                    },
                    visibility: values.visibility,
                    pageId: pageId || ""
                };
        
                console.log({createPayload});
        
                let resp: any;
    
                if (values.id) resp = await updateSection(values.id, createPayload);
                else resp = await createNewSection(createPayload as Section);
                    
                if (resp?.isError) {
                    toast({
                    variant: "destructive",
                    title: "Save failed",
                    description: values.id
                        ? "Update failed. Please check the form and try again."
                        : "Save failed. Please check the form and try again.",
                    });
                    setLoading(false);
                    return;
                }
                                
                const saved: Section = resp?.data ?? resp;
                
                toast({
                    variant: "success",
                    title: values.id ? "Hero updated" : "Hero created",
                    description: values.id
                    ? "Changes updated successfully."
                    : "Changes saved successfully.",
                });
                
                if (submitType === "save-close") {
                    router.push("/cms-manager");
                    return;
                }
                    
                if (!values.id) {
                    resetForm({ values: { ...values, id: saved.id } });
                } else {
                    onUpdated(saved);
                    resetForm({ values: { ...values, id: saved.id } });
                }
                    
            } catch (error) {
                console.error(error);
                toast({
                    variant: "destructive",
                    title: "Save failed",
                    description: "Unexpected error occurred.",
                });
            } finally {
                setLoading(false);
            }
        };
    
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, helpers) =>
                handleSubmit(values, helpers, submitTypeRef.current)
            }
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
                submitForm,
            }) => (
                <Card className="border shadow-sm">
                    <Form className="w-full">
                        <div className="grid gap-4 py-4">

                            {/* Title */}
                            <CustomFormField
                                type="text"
                                id="data.title"
                                placeholder="Title"
                                value={values.data.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.title")}
                                touched={getIn(touched, "data.title")}
                            />

                            {/* Sub Title */}
                            <CustomFormField
                                type="text"
                                id="data.subtitle"
                                placeholder="Sub Title"
                                value={values.data.subtitle}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.subtitle")}
                                touched={getIn(touched, "data.subtitle")}
                            />

                            {/* Image */}
                            <ImageInput
                                id="data.image"
                                placeholder="Web Image"
                                url={values.data.image as string}
                                required={false} 
                                setFieldValue={setFieldValue}
                                fieldName={"data.image"}
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.image")}
                                touched={getIn(touched, "data.image")}
                            />

                            {/* Mobile Image */}
                            <ImageInput
                                id="data.mobileImage"
                                placeholder="Mobile Image"
                                url={values.data.mobileImage as string}
                                required={false} 
                                setFieldValue={setFieldValue}
                                fieldName={"data.mobileImage"}
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.mobileImage")}
                                touched={getIn(touched, "data.mobileImage")}
                            />

                            {/* External Video Url */}
                            <CustomFormField
                                type="text"
                                id="data.externalVideoUrl"
                                placeholder="External Video Url"
                                value={values.data.externalVideoUrl}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.externalVideoUrl")}
                                touched={getIn(touched, "data.externalVideoUrl")}
                            />

                            {/* Padding Top */}
                            <CustomFormField
                                type="number"
                                id="data.paddingtop"
                                placeholder="Padding Top"
                                value={values.data.paddingtop}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.paddingtop")}
                                touched={getIn(touched, "data.paddingtop")}
                            />

                            {/* Padding Bottom */}
                            <CustomFormField
                                type="number"
                                id="data.paddingbottom"
                                placeholder="Padding Bottom"
                                value={values.data.paddingbottom}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.paddingbottom")}
                                touched={getIn(touched, "data.paddingbottom")}
                            />

                            {/* Order */}
                            <CustomFormField
                                type="number"
                                id="order"
                                placeholder="Order"
                                value={values.order}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.order}
                                touched={touched.order}
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
                            
                            {/* Actions */}
                            <FormActionsBtns
                                onCancelHref="/cms-manager"
                                showSaveAndClose
                                loading={loading}
                                disabled={!sessionRole}
                                onBeforeSubmit={(t) => {
                                    submitTypeRef.current = t;
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

export default MediaOnlyForm;
