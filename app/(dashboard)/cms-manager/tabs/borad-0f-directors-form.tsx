"use client"

import { createNewSection, updateSection } from "@/app/actions/section.actions";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import * as Yup from "yup";

type BoradOfDirectorsSection = Omit<Section, ""> & {
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

type BoradOfDirectorsProps = {
    pageId: string | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const BoradOfDirectorsForm = ({
    pageId,
    styleClasses,
    sessionRole,
    onUpdated,
}: BoradOfDirectorsProps) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BoradOfDirectorsSection | null>(null);
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
    const initialValues: BoradOfDirectorsSection = useMemo(
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
        values: BoradOfDirectorsSection,
        { resetForm }: FormikHelpers<BoradOfDirectorsSection>,
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
                        <div className="grid gap-4 py-4"></div>
                    </Form>
                </Card>
            )}
        </Formik>
    )                     
}

export default BoradOfDirectorsForm;