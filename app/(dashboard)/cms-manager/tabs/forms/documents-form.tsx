"use client"

import { createNewSection, getNextOrder, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section";
import { Form, Formik, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import * as Yup from "yup";

type DocumentsSection = Omit<Section, ""> & {
    data: {
        headcontent: string;
        paddingtop: number;
        paddingbottom: number;
        content: string;
    }
}

type DocumentsProps = {
    pageId: string | null;
    content: DocumentsSection | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const DocumentsForm = ({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: DocumentsProps) => {
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
    const initialValues: DocumentsSection = useMemo(
        () => ({
            id: content?.id || "",
            type: "Documents",
            layout: content?.layout || 1,
            order: content?.order || nextOrder,
            data: {
                headcontent:content?.data.headcontent || "",
                paddingtop:content?.data.paddingtop || 0,
                paddingbottom:content?.data.paddingbottom || 0,
                content:content?.data.content || "",
            },
            pageId: pageId || "",
            visibility: content?.visibility || false,
        }),[content,nextOrder]
    );

    // Validation Schema
    const validationSchema = Yup.object({
        data: Yup.object({
            
        }),
        order: Yup.number().required("Order is required"),
    });
    
    // Submit
    const handleSubmit = async (
        values: DocumentsSection,
        { resetForm }: FormikHelpers<DocumentsSection>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        
        try {
            const createPayload: Section = {
                type: values.type,
                layout: values.layout,
                order: values.order,
                data: {
                    headcontent: values.data.headcontent,
                    paddingtop: values.data.paddingtop,
                    paddingbottom: values.data.paddingbottom,
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

                            {/* Text */}
                            <CustomRichTextEditor
                                id="headcontent"
                                placeholder="headcontent"
                                required
                                value={values.data.headcontent ?? ""}
                                onChange={(e) => setFieldValue("data.headcontent", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={getIn(errors,"data.headcontent")}
                                touched={getIn(touched,"data.headcontent")}
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

export default DocumentsForm;