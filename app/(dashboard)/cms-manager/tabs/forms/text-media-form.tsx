"use client";

import {createNewSection, getNextOrder, updateSection,} from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section";
import { Form, Formik, FormikHelpers, FieldArray, getIn } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";

/* ================= TYPES ================= */

type TextMediaItem = {
    title: string;
    description: string;
    image: string;
    alignment: number;
};

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

        // Layout 4
        items?: TextMediaItem[];
    };
};

type Props = {
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

export default function TextMediaForm({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [nextOrder, setNextOrder] = useState<number>(1);
    const submitTypeRef = useRef<"save" | "save-close">("save");

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!content && pageId) {
            getNextOrder(pageId).then(setNextOrder).catch(console.error);
        }
    }, [content, pageId]);

    const initialValues: TextMediaSection = useMemo(() => ({
        id: content?.id || "",
        type: "Text-Media",
        layout: content?.layout || 1,
        order: content?.order || nextOrder,
        pageId: pageId || "",
        visibility: content?.visibility || false,
        data: {
            title: content?.data.title || "",
            subTitle: content?.data.subTitle || "",
            alignment: content?.data.alignment || 1,
            webImage: content?.data.webImage || "",
            mobileImage: content?.data.mobileImage || "",
            content: content?.data.content || "",
            buttontext: content?.data.buttontext || "",
            buttonurl: content?.data.buttonurl || "",
            paddingtop: content?.data.paddingtop || 0,
            paddingbottom: content?.data.paddingbottom || 0,
            items:
                content?.data.items ||
                (content?.layout === 4
                    ? [
                        {
                        title: "",
                        description: "",
                        image: "",
                        alignment: 1,
                        },
                    ]
                : []),
        },
    }),
    [content, nextOrder, pageId]
  );

    const validationSchema = Yup.object({
        data: Yup.object({
            title: Yup.string().required("Title is required"),
        }),
        order: Yup.number().required("Order is required"),
    });

    const handleSubmit = async (
        values: TextMediaSection,
        { resetForm }: FormikHelpers<TextMediaSection>
    ) => {
        setLoading(true);

        try {
            const payload: Section = {
                type: values.type,
                layout: values.layout,
                order: values.order,
                pageId: values.pageId,
                visibility: values.visibility,
                data: {
                    ...values.data,
                    items: values.layout === 4 ? values.data.items : undefined,
                },
            };

            const resp = values.id ? await updateSection(values.id, payload) : await createNewSection(payload);

            if (resp?.isError) throw new Error();

            toast({
                variant: "success",
                title: values.id ? "Section updated" : "Section created",
            });

            if (submitTypeRef.current === "save-close") {
                router.push("/cms-manager");
                return;
            }

            resetForm({ values: { ...values, id: resp.data?.id || values.id } });
            onUpdated(resp.data || resp);
        } catch {
            toast({
                variant: "destructive",
                title: "Save failed",
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
            onSubmit={handleSubmit}
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

                            {/* TITLE (COMMON) */}
                            <CustomFormField
                                type="text"
                                id="data.title"
                                placeholder="Title"
                                value={values.data.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.title")}
                                touched={getIn(touched, "data.title")}
                                required={false}
                            />

                            {/* LAYOUT */}
                            <CustomSelectField
                                id="layout"
                                placeholder="Layout"
                                value={values.layout}
                                onChange={(v) => setFieldValue("layout", v)}
                                options={[
                                    { label: "Layout 1", value: 1 },
                                    { label: "Layout 2", value: 2 },
                                    { label: "Layout 3", value: 3 },
                                    { label: "Layout 4", value: 4 },
                                ]}
                                styleClasses={styleClasses}
                                required={false}
                            />    
                            {values.layout !== 4 && (
                                <>
                                    <CustomFormField
                                        type="text"
                                        id="data.subTitle"
                                        placeholder="Sub Title"
                                        value={values.data.subTitle}
                                        onChange={handleChange}
                                        styleClasses={styleClasses} 
                                        onBlur={handleBlur} 
                                        required={false}
                                    />

                                    <CustomSelectField
                                        id="alignment"
                                        placeholder="Media Alignment"
                                        value={values.data.alignment}
                                        onChange={(v) => setFieldValue("data.alignment", v)}
                                        options={[
                                            { label: "Left", value: 1 },
                                            { label: "Right", value: 2 },
                                        ]}
                                        styleClasses={styleClasses}
                                        required={false}
                                    />

                                    <ImageInput
                                        id="data.webImage"
                                        placeholder="Web Image"
                                        url={values.data.webImage}
                                        setFieldValue={setFieldValue}
                                        fieldName="data.webImage"
                                        styleClasses={styleClasses}
                                        required={false}
                                    />

                                    <ImageInput
                                        id="data.mobileImage"
                                        placeholder="Mobile Image"
                                        url={values.data.mobileImage}
                                        setFieldValue={setFieldValue}
                                        fieldName="data.mobileImage"
                                        styleClasses={styleClasses}
                                        required={false}
                                    />

                                    <CustomRichTextEditor
                                        id="data.content"
                                        placeholder="Content"
                                        value={values.data.content}
                                        onChange={(e) => setFieldValue("data.content", e.target.value)}
                                        styleClasses={styleClasses} 
                                        onBlur={handleBlur}
                                    />

                                    <CustomFormField
                                        type="text"
                                        id="data.buttontext"
                                        placeholder="Button Text"
                                        value={values.data.buttontext}
                                        onChange={handleChange}
                                        styleClasses={styleClasses}
                                        onBlur={handleBlur}
                                        required={false}
                                    />

                                    <CustomFormField
                                        type="text"
                                        id="data.buttonurl"
                                        placeholder="Button Url"
                                        value={values.data.buttonurl}
                                        onChange={handleChange}
                                        styleClasses={styleClasses}
                                        onBlur={handleBlur}
                                        required={false}
                                    />
                                </>
                            )}

                            {/* ================= LAYOUT 4 ================= */}
                            {values.layout === 4 && (
                                <FieldArray name="data.items">
                                    {({ push, remove }) => (
                                        <div className="space-y-6 py-6">
                                            {values.data.items?.map((_, index) => (
                                                <Card key={index} className="space-y-4 mx-4 ">
                                                    <CustomFormField
                                                        type="text"
                                                        id={`data.items.${index}.title`}
                                                        placeholder="Item Title"
                                                        value={values.data.items![index].title}
                                                        onChange={handleChange}
                                                        styleClasses={styleClasses} 
                                                        onBlur={handleBlur} 
                                                        required={false}
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

                                                    <ImageInput
                                                        id={`data.items.${index}.image`}
                                                        placeholder="Item Image"
                                                        url={values.data.items![index].image}
                                                        setFieldValue={setFieldValue}
                                                        fieldName={`data.items.${index}.image`}
                                                        styleClasses={styleClasses} 
                                                        required={false}
                                                    />

                                                    <CustomSelectField
                                                        id={`data.items.${index}.alignment`}
                                                        placeholder="Image Alignment"
                                                        value={values.data.items![index].alignment}
                                                        onChange={(v) => setFieldValue(`data.items.${index}.alignment`,v)}
                                                        options={[
                                                            { label: "Left", value: 1 },
                                                            { label: "Right", value: 2 },
                                                        ]}
                                                        styleClasses={styleClasses}
                                                        required={false}
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

                            {/* ORDER */}
                            <CustomFormField
                                type="number"
                                id="order"
                                placeholder="Order"
                                value={values.order}
                                onChange={handleChange}
                                styleClasses={styleClasses} 
                                onBlur={handleBlur}
                                required={false}
                            />

                            {/* VISIBILITY */}
                            <CustomCheckedField
                                id="visibility"
                                placeholder="Is Publish?"
                                mode="boolean"
                                value={values.visibility}
                                onChange={(v) => setFieldValue("visibility", v)}
                                styleClasses={styleClasses} 
                                required={false}
                            />

                            {/* ACTIONS */}
                            <FormActionsBtns
                                onCancelHref="/cms-manager"
                                showSaveAndClose
                                loading={loading}
                                disabled={!sessionRole}
                                onBeforeSubmit={(t) =>
                                    (submitTypeRef.current = t)
                                }
                                onSubmitClick={submitForm}
                            />
                        </div>
                    </Form>
                </Card>
            )}
        </Formik>
    );
}
