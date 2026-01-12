"use client"

import { createNewBranche, updateBranche } from "@/app/actions/branches.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import CustomMultiInputField from "@/components/common/form-multi-input-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import MultiImageInput from "@/components/common/multi-image-input/MultiImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Branche } from "@/types/branche";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import { useMemo } from "react";
import * as Yup from "yup";

type BrancheFormProps = {
    branche: Branche | null;
    sessionRole: string | undefined;
    order: number;
};

const BrancheForm = ({branche,sessionRole,order}: BrancheFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: Branche = useMemo(
        () => ({
            id: branche?.id ?? "",
            name: branche?.name ?? "",
            image: branche?.image ?? "",
            listImage: branche?.listImage ?? [],
            description: branche?.description ?? "",
            services: branche?.services ?? "",
            phone: branche?.phone ?? [],
            latitude: branche?.latitude ?? "",
            longitude: branche?.longitude ?? "",
            slug: branche?.slug ?? "",
            visibility: branche?.visibility ?? false
        }),
        [branche]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        name: Yup.string().required("This field is mandatory"),
        visibility: Yup.boolean().required("This field is mandatory"),
    });
    
    // ========== submit form ==========
    const handleSubmit = async (
        values: Branche,
        { resetForm }: FormikHelpers<Branche>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Branche = {
                name: values.name,
                image: values.image,
                listImage: values.listImage,
                description: values.description,
                services: values.services,
                phone: values.phone,
                latitude: values.latitude,
                longitude: values.longitude,
                slug: values.slug,
                visibility: values.visibility
            }

            let resp: any;
            
            // ========== update record ==========
            if(values.id) {
                resp = await updateBranche(values.id, createPayload);
            }
            
            // ========== create new ==========
            else {
                resp = await createNewBranche(createPayload as Branche);
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
            
            const saved: Branche = resp?.data ?? resp;
            
            toast({
                variant: 'success',
                title: values.id ? 'Branche updated' : 'Branche created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })
            
            // if save and close
            if (submitType === 'save-close') {
                router.push('/branches');
            } else {
                if (!values.id) {
                    router.push(`/branches/${saved.id}`);
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

                            {/* List Images */}
                            <MultiImageInput
                                id="listImage" 
                                urls={values.listImage || ''} 
                                placeholder="ListImage" 
                                setFieldValue={setFieldValue} 
                                fieldName={'listImage'}
                                styleClasses={styleClasses}
                                error={errors.listImage}
                                touched={touched.listImage}
                                required={false}
                            />

                            {/* description */}
                            <CustomRichTextEditor
                                id="description"
                                placeholder="Description"
                                required
                                value={values.description ?? ""}
                                onChange={(e) => setFieldValue("description", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={errors.description}
                                touched={touched.description}
                            />

                            {/* services */}
                            <CustomRichTextEditor
                                id="services"
                                placeholder="Services"
                                required
                                value={values.services ?? ""}
                                onChange={(e) => setFieldValue("services", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={errors.services}
                                touched={touched.services}
                            />

                            {/* phone */}
                            <CustomMultiInputField 
                                type="text"
                                id="phone"
                                placeholder="Phone"
                                values={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                
                                styleClasses={styleClasses}
                                error={errors.phone}
                                touched={touched.phone}
                            />

                            {/* Latitude */}
                            <CustomFormField
                                type="text"
                                id="latitude"
                                placeholder="Latitude"
                                value={values.latitude}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.latitude}
                                touched={touched.latitude}
                            />

                            {/* Longitude */}
                            <CustomFormField
                                type="text"
                                id="longitude"
                                placeholder="Longitude"
                                value={values.longitude}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.longitude}
                                touched={touched.longitude}
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
                                onCancelHref="/branches"
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

export default BrancheForm;