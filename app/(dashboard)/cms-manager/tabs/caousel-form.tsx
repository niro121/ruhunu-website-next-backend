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
import { FieldArray, Form, Formik, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import * as Yup from "yup";

type CaouselSection = Omit<Section, ""> & {
    data: {
        title: string;
        subTitle: string;
        paddingtop: number;
        paddingbottom: number;
        layout: number;
        content: {
                image: string;
                title: string;
                description: string;
            }[]
    }
}

type CaouselProps = {
    pageId: string | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const CaouselForm = ({
    pageId,
    styleClasses,
    sessionRole,
    onUpdated,
}: CaouselProps) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CaouselSection | null>(null);
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
    const initialValues: CaouselSection = useMemo(
        () => ({
            id: data?.id || "",
            type: "Caousel",
            layout: data?.layout || 1,
            order: data?.order || 2,
            data: {
                title:data?.data.title || "",
                subTitle:data?.data.subTitle || "",
                paddingtop:data?.data.paddingtop || 0,
                paddingbottom:data?.data.paddingbottom || 0,
                layout:data?.data.layout || 1,
                content:
                    data?.data?.content && Array.isArray(data.data.content)
                    ? data.data.content.map((item) => ({
                        image: item?.image || "",
                        title: item?.title || "",
                        description: item?.description || "",
                        }))
                    : [
                        {
                            image: "",
                            title: "",
                            description: "",
                        },
                    ],
            },
            pageId: pageId || "",
            visibility: data?.visibility || false,
        }),[data]
    );

    // Validation Schema
    const validationSchema = Yup.object({
        data: Yup.object({
        }),
        order: Yup.number().required("Order is required"),
    });
    
    // Submit
    const handleSubmit = async (
        values: CaouselSection,
        { resetForm }: FormikHelpers<CaouselSection>,
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
                    paddingtop: values.data.paddingtop,
                    paddingbottom: values.data.paddingbottom,
                    layout: values.data.layout,
                    content: values.data.content,
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

                            <FieldArray name="data.content">
                                {({ push, remove }) => (
                                    <div className="flex gap-4 px-3">
                                        {/* LEFT SIDE: Label + Add Button */}
                                        <div className="flex flex-col items-start w-42 gap-2 pt-2">
                                            <span className="font-semibold text-gray-700">Content</span>
                                        </div>

                                        {/* RIGHT SIDE: Content Cards */}
                                        <div className="flex-1 flex flex-col gap-6">
                                            {values.data.content.map((item, index) => (
                                                <Card key={index} className="border shadow-sm p-4 relative">
                                                    <div className="grid gap-4">

                                                        {/* IMAGE */}
                                                        <ImageInput
                                                            id={`data.content.${index}.image`}
                                                            placeholder="Image"
                                                            url={item.image}
                                                            required={false}
                                                            setFieldValue={setFieldValue}
                                                            fieldName={`data.content.${index}.image`}
                                                            styleClasses={styleClasses}
                                                            error={getIn(errors, `data.content.${index}.image`)}
                                                            touched={getIn(touched, `data.content.${index}.image`)}
                                                        />

                                                        {/* TITLE */}
                                                        <CustomFormField
                                                            type="text"
                                                            id={`data.content.${index}.title`}
                                                            placeholder="Title"
                                                            value={item.title}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            styleClasses={styleClasses}
                                                            error={getIn(errors, `data.content.${index}.title`)}
                                                            touched={getIn(touched, `data.content.${index}.title`)}
                                                        />

                                                        {/* DESCRIPTION */}
                                                        <CustomFormField
                                                            type="text"
                                                            id={`data.content.${index}.description`}
                                                            placeholder="Description"
                                                            value={item.description}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            styleClasses={styleClasses}
                                                            error={getIn(errors, `data.content.${index}.description`)}
                                                            touched={getIn(touched, `data.content.${index}.description`)}
                                                        />
                                                    </div>

                                                    {/* REMOVE BUTTON */}
                                                    {values.data.content.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </Card>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    push({
                                                        image: "",
                                                        title: "",
                                                        description: "",
                                                    })
                                                }
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                            >
                                                + Add Content
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>


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

export default CaouselForm;