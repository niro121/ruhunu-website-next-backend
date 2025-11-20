"use client";

import { createNewSection, getNextOrder, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import CustomFormField from "@/components/common/form-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section";
import { Formik, Form, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

type TextOnlySection = Omit<Section, ""> & {
    data: {
        title: string;
        subtitle: string;
        content: string;
        buttontext: string;
        buttonurl: string;
        paddingtop: number;
        paddingbottom: number;
    };
};

type TextOnlyProps = {
    pageId: string | null;
    content: TextOnlySection | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: () => void;
};

const TextOnlyForm = ({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: TextOnlyProps) => {
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

    const initialValues: TextOnlySection = useMemo(
        () => ({
            id: content?.id || "",
            type: content?.type || "Text Only",
            layout: content?.layout || 1,
            order: content?.order || nextOrder,
            data: {
                title: content?.data.title || "",
                subtitle: content?.data.subtitle || "",
                content: content?.data.content || "",
                buttontext: content?.data.buttontext || "",
                buttonurl: content?.data.buttonurl || "",
                paddingtop: content?.data.paddingtop || 0,
                paddingbottom: content?.data.paddingbottom || 0,
            },
            visibility: content?.visibility ?? false,
            pageId: pageId || "",
        }),
        [content, pageId,nextOrder]
    );

    const validationSchema = Yup.object({
        data: Yup.object({
            title: Yup.string().required("Title is required"),
        }),
        order: Yup.number().required("Order is required"),
    });

    const handleSubmit = async (
        values: TextOnlySection,
        { resetForm }: FormikHelpers<TextOnlySection>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);

        try {
            const payload: Section = {
                type: values.type,
                layout: values.layout,
                order: values.order,
                data: values.data,
                visibility: values.visibility,
                pageId: pageId || "",
            };

            let resp: any;

            if (values.id) resp = await updateSection(values.id, payload);
            else resp = await createNewSection(payload);

            if (resp?.isError) {
                toast({
                    variant: "destructive",
                    title: "Save failed",
                    description: "Please check the form and try again.",
                });
                setLoading(false);
                return;
            }

            const saved: Section = resp?.data ?? resp;

            toast({
                variant: "success",
                title: values.id ? "Updated" : "Created",
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
                onUpdated();
                resetForm({ values: { ...values, id: saved.id } });
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
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

                                {/* Content */}
                                <CustomRichTextEditor
                                    id="data.content"
                                    placeholder="Content"
                                    required
                                    value={values.data.content}
                                    onChange={(e) => setFieldValue("data.content", e.target.value)}
                                    onBlur={handleBlur}
                                    styleClasses={styleClasses}
                                    error={getIn(errors, "data.content")}
                                    touched={getIn(touched, "data.content")}
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
};

export default TextOnlyForm;
