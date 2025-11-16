"use client"

import { createNewSection, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section";
import { Form, Formik, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

type TextTextSection = Omit<Section, ""> & {
    data: {
        title: string;
        subTitle: string;
        content: string;
        contentright: string;
        buttontext: string;
        buttonurl: string;
        buttontextright: string;
        buttonurlright: string;
        paddingtop: number;
        paddingbottom: number;
    }
}

type TextTextProps = {
    pageId: string | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const TextTextForm = ({
    pageId,
    styleClasses,
    sessionRole,
    onUpdated,
}: TextTextProps) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TextTextSection | null>(null);
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
    const initialValues: TextTextSection = useMemo(
        () => ({
            id: data?.id || "",
            type: "Text-Media",
            layout: data?.layout || 1,
            order: data?.order || 2,
            data: {
                title:data?.data.title || "",
                subTitle:data?.data.subTitle || "",
                content:data?.data.content || "",
                contentright:data?.data.contentright || "",
                buttontext:data?.data.buttontext || "",
                buttonurl:data?.data.buttonurl || "",
                buttontextright:data?.data.buttontextright || "",
                buttonurlright:data?.data.buttonurlright || "",
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
        values: TextTextSection,
        { resetForm }: FormikHelpers<TextTextSection>,
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
                    content: values.data.content,
                    contentright: values.data.contentright,
                    buttontext: values.data.buttontext,
                    buttonurl: values.data.buttonurl,
                    buttontextright: values.data.buttontextright,
                    buttonurlright: values.data.buttonurlright,
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
                                id="data.subTitle"
                                placeholder="Sub Title"
                                value={values.data.subTitle}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.subTitle")}
                                touched={getIn(touched, "data.subTitle")}
                            />
                            
                            {/* Content */}
                            <CustomRichTextEditor
                                id="content"
                                placeholder="Content"
                                required
                                value={values.data.content ?? ""}
                                onChange={(e) => setFieldValue("data.content", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={getIn(errors,"data.content")}
                                touched={getIn(touched,"data.content")}
                            />

                            {/* Content right */}
                            <CustomRichTextEditor
                                id="contentright"
                                placeholder="Content right"
                                required
                                value={values.data.contentright ?? ""}
                                onChange={(e) => setFieldValue("data.contentright", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={getIn(errors,"data.contentright")}
                                touched={getIn(touched,"data.contentright")}
                            />

                            {/* Button Text */}
                            <CustomFormField
                                type="text"
                                id="data.buttontext"
                                placeholder="Button Text"
                                value={values.data.buttontext}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.buttontext")}
                                touched={getIn(touched, "data.buttontext")}
                            />

                            {/* Button Url */}
                            <CustomFormField
                                type="text"
                                id="data.buttonurl"
                                placeholder="Button Url"
                                value={values.data.buttonurl}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.buttonurl")}
                                touched={getIn(touched, "data.buttonurl")}
                            />

                            {/* Button Text right */}
                            <CustomFormField
                                type="text"
                                id="data.buttontextright"
                                placeholder="Button Text right"
                                value={values.data.buttontextright}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.buttontextright")}
                                touched={getIn(touched, "data.buttontextright")}
                            />

                            {/* Button Url right */}
                            <CustomFormField
                                type="text"
                                id="data.buttonurlright"
                                placeholder="Button Url right"
                                value={values.data.buttonurlright}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.buttonurlright")}
                                touched={getIn(touched, "data.buttonurlright")}
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
    );
}

export default TextTextForm;