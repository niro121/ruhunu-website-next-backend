"use client"

import { createNewSection, getNextOrder, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
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

type TextMediaSection = Omit<Section, ""> & {
    data: {
        title: string;
        subTitle: string;
        alignment: number;
        webImage: string;
        mobileImage: string;
        content: string;
        buttontext: string;
        buttonurl: string;
        paddingtop: number;
        paddingbottom: number;
    }
}

type TextMediaProps = {
    pageId: string | null;
    content: TextMediaSection | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
};

const TextMediaForm = ({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: TextMediaProps) => {
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
    const initialValues: TextMediaSection = useMemo(
        () => ({
            id: content?.id || "",
            type: "Text-Media",
            layout: content?.layout || 1,
            order: content?.order || nextOrder,
            data: {
                title:content?.data.title || "",
                subTitle:content?.data.subTitle || "",
                alignment:content?.data.alignment || 1,
                webImage:content?.data.webImage || "",
                mobileImage:content?.data.mobileImage || "",
                content:content?.data.content || "",
                buttontext:content?.data.buttontext || "",
                buttonurl:content?.data.buttonurl || "",
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
        values: TextMediaSection,
        { resetForm }: FormikHelpers<TextMediaSection>,
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
                    alignment: values.data.alignment,
                    webImage: values.data.webImage,
                    mobileImage: values.data.mobileImage,
                    content: values.data.content,
                    buttontext: values.data.buttontext,
                    buttonurl: values.data.buttonurl,
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
                                    { label: "Layout 3", value: 3 },
                                ]}
                                styleClasses={styleClasses}
                                error={errors.layout}
                                touched={touched.layout}
                            />

                            {/* Media Alignment */}
                            <CustomSelectField
                                id="alignment"
                                placeholder="Media Alignment"
                                required
                                value={values.data.alignment}
                                onChange={(v) => setFieldValue("alignment", v)}
                                onBlur={handleBlur}
                                options={[
                                    { label: "Left", value: 1 },
                                    { label: "Right", value: 2 },
                                ]}
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.alignment")}
                                touched={getIn(touched, "data.alignment")}
                            />

                            {/* Web Image */}
                            <ImageInput
                                id="data.webImage"
                                placeholder="Web Image"
                                url={values.data.webImage as string}
                                required={false} 
                                setFieldValue={setFieldValue}
                                fieldName={"data.webImage"}
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.webImage")}
                                touched={getIn(touched, "data.webImage")}
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

export default TextMediaForm;