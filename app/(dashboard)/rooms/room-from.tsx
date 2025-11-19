"use client"

import { createNewRoom, updateRoom } from "@/app/actions/rooms.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Rooms } from "@/types/room";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type RoomsFormProps = {
    rooms: Rooms | null;
    sessionRole: string | undefined;
    order: number;
    categorys: { name: string }[];
};

const RoomsForm = ({rooms,sessionRole,order,categorys}: RoomsFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: Rooms = useMemo(
        () => ({
            id: rooms?.id ?? "",
            name: rooms?.name ?? "",
            category: rooms?.category ?? "",
            image: rooms?.image ?? "",
            content: rooms?.content ?? "",
            slug: rooms?.slug ?? "",
            order: typeof rooms?.order === 'number' ? rooms.order : order,
            visibility: rooms?.visibility ?? false
        }),
        [rooms]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        name: Yup.string().required("This field is mandatory"),
        visibility: Yup.boolean().required("This field is mandatory"),
    });
    
    // ========== submit form ==========
    const handleSubmit = async (
        values: Rooms,
        { resetForm }: FormikHelpers<Rooms>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Rooms = {
                name: values.name,
                category: values.category,
                image: values.image,
                content: values.content,
                slug: values.slug,
                order: values.order,
                visibility: values.visibility,
            }

            let resp: any;
            
            // ========== update record ==========
            if(values.id) {
                resp = await updateRoom(values.id, createPayload);
            }
            
            // ========== create new ==========
            else {
                resp = await createNewRoom(createPayload as Rooms);
            }

            if (resp?.isError) {
                toast({
                    variant: 'destructive',
                    title: 'Save failed',
                    description: values.id
                        ? 'Update failed. Please check the form and try again.'
                        : 'Save failed. Please check the form and try again.'
                });
                setLoading(false);
                return;
            }
            
            const saved: Rooms = resp?.data ?? resp;
            
            toast({
                variant: 'success',
                title: values.id ? 'Rooms updated' : 'Rooms created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })
            
            // if save and close
            if (submitType === 'save-close') {
                router.push('/rooms');
            } else {
                if (!values.id) {
                    router.push(`/rooms/${saved.id}`);
                }
            }
            
            // refresh local form with saved id
            resetForm({ values: { ...values, id: saved.id } });
            
        } catch (error: any) {
            setLoading(false);
            console.error(error);
            toast({
                variant: "destructive",
                title: "Save failed",
                description: "Unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    }

    const styleClasses = {
        parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
        labelClassName: "text-sm text-black font-semibold capitalize",
        inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, helpers) =>
                handleSubmit(values, helpers, submitTypeRef.current)
            }
        >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
                <Card className="border shadow-sm">
                    {/* FORM START */}
                    <Form className="w-full">
                        <div className="grid gap-4 py-4">

                            {/* Name */}
                            <CustomFormField
                                type="text"
                                id="name"
                                placeholder="Name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.name}
                                touched={touched.name}
                            />

                            {/* Category */}
                            <CustomSelectField
                                id="category"
                                placeholder="Category"
                                required={false}
                                value={values.category} 
                                onChange={(v) => setFieldValue('category', v)}
                                onBlur={handleBlur}
                                options={[
                                        // { label: "Select Category", value: "" }, 
                                        ...(categorys?.map((c) => ({
                                        label: c.name,
                                        value: c.name,
                                    })) || []),
                                ]}
                                styleClasses={styleClasses}
                                error={errors.category}
                                touched={touched.category}
                            />

                            {/* Image */}
                            <ImageInput
                                id="image"
                                placeholder="Image"
                                url={values.image || ''}
                                setFieldValue={setFieldValue}
                                fieldName={'image'}
                                styleClasses={styleClasses}
                                error={errors.image}
                                touched={touched.image}
                                required={false}
                            />

                            {/* description */}
                            <CustomRichTextEditor
                                id="content"
                                placeholder="content"
                                required
                                value={values.content ?? ""}
                                onChange={(e) => setFieldValue("content", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={errors.content}
                                touched={touched.content}
                            />

                            {/* Slug */}
                            <CustomFormField
                                type="text"
                                id="slug"
                                placeholder="Slug Auto Generete"
                                value={values.slug}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                disabled
                                styleClasses={styleClasses}
                                error={errors.slug}
                                touched={touched.slug}
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

                            {/* visibility */}
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

                            {/* Save Buttons */}
                            <FormActionsBtns
                                onCancelHref="/rooms"
                                showSaveAndClose
                                loading={loading}
                                disabled={!sessionRole}
                                onBeforeSubmit={(t) => { submitTypeRef.current = t; }}
                                onSubmitClick={() => submitForm()}
                            />
                            
                        </div>
                    </Form>
                </Card>
            )}
        </Formik>
    )
}

export default RoomsForm;