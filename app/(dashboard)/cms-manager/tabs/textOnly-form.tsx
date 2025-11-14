"use client"

import { createNewSection, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section";
import { Value } from "@radix-ui/react-select";
import { Form, Formik, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import { title } from "process";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import * as Yup from "yup";

type TextOnlySection = Omit<Section, ""> & {
    data: {
        title: string;
    }
}

type TextOnlyProps = {
    pageId: string | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
};

const TextOnlyForm = ({
    pageId,
    styleClasses,
    sessionRole,
    onUpdated,
}: TextOnlyProps) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<TextOnlySection | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    // Fetch data
    const fetchData = async () => {
        if (!pageId) return;
    
        setLoading(true);
        try {
            // const res = await getHeroData(pageId);
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
    const initialValues: TextOnlySection = useMemo(
        () => ({
            id: data?.id || "",
            type: "Text-Only",
            layout: data?.layout || 1,
            order: data?.order || 2,
            data: {
                title:data?.data.title || "",
            },
            pageId: pageId || "",
            visibility: data?.visibility || false,
        }),[data]
    );

    // Validation Schema
    const validationSchema = Yup.object({
        data: Yup.object({
            title: Yup.string().required("Title is required"),
        }),
        order: Yup.number().required("Order is required"),
    });

    // Submit
    const handleSubmit = async (
        values: TextOnlySection,
        { resetForm }: FormikHelpers<TextOnlySection>,
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
                },
                visibility: values.visibility,
                pageId: pageId || ""
            };

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
                            {/* Type */}
                            <CustomFormField
                                type="text"
                                id="type"
                                placeholder="Type"
                                value={values.type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                disabled
                                styleClasses={styleClasses}
                                error={errors.type}
                                touched={touched.type}
                            />

                            {/* Layout */}
                            <CustomSelectField
                                id="layout"
                                placeholder="Layout"
                                required
                                value={values.layout}
                                onChange={(v) => setFieldValue("layout", v)}
                                onBlur={handleBlur}
                                options={[
                                    { label: "Layout 1", value: 1 },
                                    { label: "Layout 2", value: 2 },
                                ]}
                                styleClasses={styleClasses}
                                error={errors.layout}
                                touched={touched.layout}
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

export default TextOnlyForm;