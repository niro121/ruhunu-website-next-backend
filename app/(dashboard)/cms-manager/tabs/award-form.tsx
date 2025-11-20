"use client"

import { createNewSection, getNextOrder, updateSection } from "@/app/actions/section.actions";
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

type AwardSection = Omit<Section, ""> & {
    data: {
        title: string;
        layout: number;
        award: {
            image: string;
            order: number;
            visibility: boolean;
        }[];
    }
}

type AwardProps = {
    pageId: string | null;
    content: AwardSection | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const AwardForm = ({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: AwardProps) => {
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
    const initialValues: AwardSection = useMemo(
        () => ({
            id: content?.id || "",
            type: "Award",
            layout: content?.layout || 1,
            order: content?.order || nextOrder,
            data: {
                title:content?.data.title || "",
                layout:content?.data.layout || 1,
                award:content?.data.award && Array.isArray(content.data.award) ? content.data.award.map((item) => ({
                    image: item?.image || "",
                    order: item?.order || 1,
                    visibility: item?.visibility || false,
                })) : [
                    {
                        image: "",
                        order: 1,
                        visibility: false,
                    }
                ]
            },
            pageId: pageId || "",
            visibility: content?.visibility || false,
        }),[content,nextOrder]
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
        values: AwardSection,
        { resetForm }: FormikHelpers<AwardSection>,
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
                    layout: values.data.layout,
                    award: values.data.award.map((item, index) => ({
                        image: item.image,
                        order: item.order,
                        visibility: item.visibility,
                    })),
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
                title: values.id ? "Section updated" : "Section created",
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

                            <FieldArray name="data.award">
                                {({ push, remove }) => (
                                    <div className="flex gap-4 px-3">
                                        {/* LEFT SIDE: Label + Add Button */}
                                        <div className="flex flex-col items-start w-42 gap-2 pt-2">
                                            <span className="font-semibold text-gray-700">Award Details</span>
                                        </div>
                            
                                        {/* RIGHT SIDE: award Cards */}
                                        <div className="flex-1 flex flex-col gap-6">
                                            {values.data.award.map((item, index) => (
                                                <Card key={index} className="border shadow-sm p-4 relative">
                                                    <div className="grid gap-4">
                            
                                                        {/* IMAGE */}
                                                        <ImageInput
                                                            id={`data.award.${index}.image`}
                                                            placeholder="Image"
                                                            url={item.image}
                                                            required={false}
                                                            setFieldValue={setFieldValue}
                                                            fieldName={`data.award.${index}.image`}
                                                            styleClasses={styleClasses}
                                                            error={getIn(errors, `data.award.${index}.image`)}
                                                            touched={getIn(touched, `data.award.${index}.image`)}
                                                        />
                            
                                                        {/* ORDER */}
                                                        <CustomFormField
                                                            type="number"
                                                            id={`data.award.${index}.order`}
                                                            placeholder="Award Order"
                                                            value={item.order}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            styleClasses={styleClasses}
                                                            error={getIn(errors, `data.award.${index}.order`)}
                                                            touched={getIn(touched, `data.award.${index}.order`)}
                                                        />

                                                        {/* VISIBILI */}
                                                        <CustomCheckedField
                                                            id={`data.award.${index}.visibility`}
                                                            placeholder="Award Is Publish?"
                                                            required
                                                            mode="boolean"
                                                            value={item.visibility}
                                                            onChange={(val) => setFieldValue(`data.award.${index}.visibility`, val)}
                                                            onBlur={handleBlur}
                                                            error={getIn(errors, `data.award.${index}.visibility`)}
                                                            touched={getIn(touched, `data.award.${index}.visibility`)}
                                                            styleClasses={styleClasses}
                                                        />
                            
                                                                                    
                                                    </div>
                            
                                                    {/* REMOVE BUTTON */}
                                                    {values.data.award.length > 1 && (
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
                                                        order: values.data.award.length + 1,
                                                        visibility: false,
                                                    })
                                                }
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                            >
                                                + Add award
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

export default AwardForm;