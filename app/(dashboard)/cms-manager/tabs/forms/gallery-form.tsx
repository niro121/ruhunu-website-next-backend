"use client"

import { createNewSection, getNextOrder, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import MultiImageInput from "@/components/common/multi-image-input/MultiImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section"
import { FieldArray, Form, Formik, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import * as Yup from "yup";

type GalleryItem = {
    image: string;
    title: string;
    description: string;
}

type GallerySection = Omit<Section, ""> & {
    data: {
        title: string;
        images: string[];
        paddingtop: number;
        paddingbottom: number;

        items?: GalleryItem[];
    }
}

type GalleryProps = {
    pageId: string | null;
    content: GallerySection | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const GalleryForm = ({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: GalleryProps) => {
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
    const initialValues: GallerySection = useMemo(
        () => ({
            id: content?.id || "",
            type: "Gallery",
            layout: content?.layout || 1,
            order: content?.order || nextOrder,
            data: {
                title: content?.data.title || "",
                images: Array.isArray(content?.data?.images)? content.data.images: [],
                paddingtop:content?.data.paddingtop || 0,
                paddingbottom:content?.data.paddingbottom || 0,
                items: 
                    content?.data.items || 
                    (content?.layout === 2 
                        ? [
                            {
                                image: "",
                                title: "",
                                description: "",
                            }
                        ]
                    : []),
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
        values: GallerySection,
        { resetForm }: FormikHelpers<GallerySection>,
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
                    images: values.data.images,
                    paddingtop: values.data.paddingtop,
                    paddingbottem: values.data.paddingbottom,
                    items: values.layout === 2 ? values.data.items : undefined,
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
                                    id="layout"
                                    placeholder="Layout"
                                    value={values.layout}
                                    onChange={(v) => setFieldValue("layout", v)}
                                    options={[
                                        { label: "Layout 1", value: 1 },
                                        { label: "Layout 2", value: 2 },
                                        { label: "Layout 3", value: 3 },
                                        //{ label: "Layout 4", value: 4 },
                                    ]}
                                    styleClasses={styleClasses}
                                    required={false}
                                /> 
                                
                                {values.layout !==2  && (
                                    <>
                                        {/* Images */}
                                        <MultiImageInput 
                                            id="data.images" 
                                            urls={values.data.images as string[]} 
                                            placeholder="Web Images"
                                            required={false} 
                                            setFieldValue={setFieldValue} 
                                            fieldName={"data.images"}
                                            styleClasses={styleClasses}
                                            error={getIn(errors, "data.images")}
                                            touched={getIn(touched, "data.images")}
                                        />
                                    </>
                                )}

                                {values.layout === 2 && (
                                    <FieldArray name="data.items">
                                        {({ push, remove }) => (
                                            <div className="space-y-6 py-6">
                                                {values.data.items?.map((_, index) => (
                                                    <Card key={index} className="space-y-4 mx-4 ">

                                                        <ImageInput
                                                            id={`data.items.${index}.image`}
                                                            placeholder="Item Image"
                                                            url={values.data.items![index].image}
                                                            setFieldValue={setFieldValue}
                                                            fieldName={`data.items.${index}.image`}
                                                            styleClasses={styleClasses} 
                                                            required={false}
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

                                                        <CustomRichTextEditor
                                                            id={`data.items.${index}.description`}
                                                            placeholder="Description"
                                                            value={values.data.items![index].description}
                                                            onChange={(e) => setFieldValue(
                                                                `data.items.${index}.description`,
                                                                e.target.value
                                                            )}
                                                            styleClasses={styleClasses} 
                                                            onBlur={handleBlur}
                                                        />
                                                        
                                                        <div className="flex justify-center">
                                                            <button
                                                                type="button"
                                                                className="text-white bg-red-500 text-sm py-2 w-full mx-4 rounded"
                                                                onClick={() => remove(index)}
                                                            >
                                                                Remove Item
                                                            </button>
                                                        </div>
                                                    </Card>
                                                ))}
                                                <div className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        className="w-full py-2 bg-green-600 text-white rounded mx-4 justify-self-center"
                                                        onClick={() =>
                                                            push({
                                                                title: "",
                                                                description: "",
                                                                image: "",
                                                                alignment: 1,
                                                            })
                                                        }
                                                    >
                                                        + Add Item
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>
                                )}

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

export default GalleryForm;