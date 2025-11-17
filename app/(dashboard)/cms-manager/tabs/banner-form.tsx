"use client"

import { createNewSection, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomSelectField from "@/components/common/custom-select-field";
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

type BannerSection = Omit<Section, ""> & {
    data: {
        ctaBanner: string;
        heading: string;
        layout: number;
        title: string;
        subTitle: string;
        backgroundColor: string;
        image: string;
        mobileImage: string;
        ctaUrl: string;
        paddingtop: number;
        paddingbottom: number;
    }
}

type BannerProps = {
    pageId: string | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const BannerForm = ({
    pageId,
    styleClasses,
    sessionRole,
    onUpdated,
}: BannerProps) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BannerSection | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");
    
    // Fetch data
    const fetchData = async () => {
        if (!pageId) return;
            
        setLoading(true);
        try {
            // const res = await fetchSectionById(pageId);
            // if (res.data) {
            //     // Cast Prisma JSON field safely
            //     const sectionData = res.data.data as unknown as {
            //         title?: string;
            //         webImage?: string | string[];
            //         mobileImage?: string | string[];
            //     };
        
            //     const heroData: HeroSection = {
            //         ...res.data,
            //         data: {
            //         title: sectionData.title ?? "",
            //         webImage: sectionData.webImage ?? "",
            //         mobileImage: sectionData.mobileImage ?? "",
            //         },
            //     };
            
            //     setData(heroData);
            // } else {
            //     setData(null);
            // }
        } catch (error) {
            console.error("Error fetching hero data:", error);
        } finally {
            setLoading(false);
        }
    };
            
    useEffect(() => {
        fetchData();
    }, [pageId]);

    // Initial Values
    const initialValues: BannerSection = useMemo(
        () => ({
            id: data?.id || "",
            type: "Banner",
            layout: data?.layout || 1,
            order: data?.order || 2,
            data: {
                ctaBanner: data?.data.ctaBanner || "",
                heading: data?.data.heading || "",
                layout: data?.data.layout || 1,
                title:data?.data.title || "",
                subTitle:data?.data.subTitle || "",
                backgroundColor: data?.data.backgroundColor || "",
                image: data?.data.image || "",
                mobileImage: data?.data.mobileImage || "",
                ctaUrl: data?.data.ctaUrl || "",
                paddingtop:data?.data.paddingtop || 0,
                paddingbottom:data?.data.paddingbottom || 0,
            },
            pageId: pageId || "",
            visibility: data?.visibility || false,
        }),[data]
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
        values: BannerSection,
        { resetForm }: FormikHelpers<BannerSection>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        
        try {
            const createPayload: Section = {
                type: values.type,
                layout: values.layout,
                order: values.order,
                data: {
                    ctaBanner: values.data.ctaBanner,
                    heading: values.data.heading,
                    layout: values.data.layout,
                    title: values.data.title,
                    subTitle: values.data.subTitle,
                    backgroundColor: values.data.backgroundColor,
                    image: values.data.image,
                    mobileImage: values.data.mobileImage,
                    ctaUrl: values.data.ctaUrl,
                    paddingtop: values.data.paddingtop,
                    paddingbottom: values.data.paddingbottom,
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

                            {/* CTA Banner */}
                            <CustomFormField
                                type="text"
                                id="data.Banner"
                                placeholder="CTA Url"
                                value={values.data.Banner}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.Banner")}
                                touched={getIn(touched, "data.Banner")}
                            />

                            {/* Heading */}
                            <CustomFormField
                                type="text"
                                id="data.heading"
                                placeholder="Heading"
                                value={values.data.heading}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.heading")}
                                touched={getIn(touched, "data.heading")}
                            />

                            {/* Layout */}
                            <CustomSelectField
                                id="data.layout"
                                placeholder="Layout"
                                required
                                value={values.data.layout}
                                onChange={(v) => setFieldValue("data.layout", v)}
                                onBlur={handleBlur}
                                options={[
                                    { label: "Layout 1", value: 1 },
                                    { label: "Layout 2", value: 2 },
                                    { label: "Layout 3", value: 3 },
                                ]}
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.layout")}
                                touched={getIn(touched, "data.layout")}
                            />
                            

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

                            {/* Background Color */}
                            <CustomFormField
                                type="color"
                                id="data.backgroundColor"
                                placeholder="Sub Title"
                                value={values.data.backgroundColor}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.backgroundColor")}
                                touched={getIn(touched, "data.backgroundColor")}
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

                            {/* CTA Url */}
                            <CustomFormField
                                type="text"
                                id="data.ctaUrl"
                                placeholder="CTA Url"
                                value={values.data.ctaUrl}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.ctaUrl")}
                                touched={getIn(touched, "data.ctaUrl")}
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

export default BannerForm;