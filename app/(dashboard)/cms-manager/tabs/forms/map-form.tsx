"use client"

import { createNewSection, fetchSectionById, getNextOrder, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section";
import { FieldArray, Form, Formik, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import * as Yup from "yup";

type MapSection = Omit<Section, ""> & {
    data: {
        title: string;
        paddingtop: number;
        paddingbottom: number;
        content: {
            name: string;
            latitude: string;
            longitude: string;
        }[]
    }
}

type MapProps = {
    pageId: string | null;
    content: MapSection | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const MapForm = ({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: MapProps) => {
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
    const initialValues: MapSection = useMemo(
        () => ({
            id: content?.id || "",
            type: "Map",
            layout: content?.layout || 1,
            order: content?.order || nextOrder,
            data: {
                title:content?.data.title || "",
                paddingtop:content?.data.paddingtop || 0,
                paddingbottom:content?.data.paddingbottom || 0,
                content:
                    content?.data?.content && Array.isArray(content.data.content)
                    ? content.data.content.map((item) => ({
                        name: item?.name || "",
                        latitude: item?.latitude || "",
                        longitude: item?.longitude || "",
                        }))
                    : [
                        {
                            name: "",
                            latitude: "",
                            longitude: "",
                        },
                    ],
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
        values: MapSection,
        { resetForm }: FormikHelpers<MapSection>,
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
                    paddingtop: values.data.paddingtop,
                    paddingbottem: values.data.paddingbottom,
                    content: values.data.content.map((item, index) => ({
                        name: item.name,
                        latitude: item.latitude,
                        longitude: item.longitude,
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

                                                        {/* TITLE */}
                                                        <CustomFormField
                                                            type="text"
                                                            id={`data.content.${index}.name`}
                                                            placeholder="Title"
                                                            value={item.name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            styleClasses={styleClasses}
                                                            error={getIn(errors, `data.content.${index}.name`)}
                                                            touched={getIn(touched, `data.content.${index}.name`)}
                                                        />

                                                        {/* LATITUDE */}
                                                        <CustomFormField
                                                            type="text"
                                                            id={`data.content.${index}.latitude`}
                                                            placeholder="Latitude"
                                                            value={item.latitude}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            styleClasses={styleClasses}
                                                            error={getIn(errors, `data.content.${index}.latitude`)}
                                                            touched={getIn(touched, `data.content.${index}.latitude`)}
                                                        />

                                                        {/* Latitude */}
                                                        <CustomFormField
                                                            type="text"
                                                            id={`data.content.${index}.longitude`}
                                                            placeholder="Latitude"
                                                            value={item.longitude}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            styleClasses={styleClasses}
                                                            error={getIn(errors, `data.content.${index}.longitude`)}
                                                            touched={getIn(touched, `data.content.${index}.longitude`)}
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
                                                        name: "",
                                                        latitude: "",
                                                        longitude: "",
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

export default MapForm;