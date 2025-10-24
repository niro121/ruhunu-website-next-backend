"use client"

import { createNewService, updateService } from "@/app/actions/service.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import CustomMultiInputField from "@/components/common/form-multi-input-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Service } from "@/types/service";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type ServiceFormProps = {
    service: Service | null;
    sessionRole: string | undefined;
    order: number;
}

const ServiceForm = ({service,sessionRole,order}: ServiceFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: Service = useMemo(
        () => ({
            id: service?.id ?? "",
            name: service?.name ?? "",
            image: service?.image ?? "",
            content: service?.content ?? "",
            phone: service?.phone ?? [],
            email: service?.email ?? [],
            slug: service?.slug ?? "",
            featured: service?.featured ?? false,
            visibility: service?.visibility ?? false
        }),
        [service]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        name: Yup.string().required("This field is mandatory"),
        visibility: Yup.boolean().required("This field is mandatory"),
    });

    // ========== submit form ==========
    const handleSubmit = async (
        values: Service,
        { resetForm }: FormikHelpers<Service>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Service = {
                name: values.name,
                image: values.image,
                content: values.content,
                phone: values.phone,
                email: values.email,
                slug: values.slug,
                featured: values.featured,
                visibility: values.visibility
            }

            let resp: any;
            
            // ========== update record ==========
            if(values.id) {
                resp = await updateService(values.id, createPayload);
            }
            
            // ========== create new ==========
            else {
                resp = await createNewService(createPayload as Service);
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
            
            const saved: Service = resp?.data ?? resp;
            
            toast({
                variant: 'success',
                title: values.id ? 'Service updated' : 'Service created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })
            
            // if save and close
            if (submitType === 'save-close') {
                router.push('/services');
            } else {
                if (!values.id) {
                    router.push(`/services/${saved.id}`);
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
                                <CustomFormField
                                    type="text"
                                    id="image"
                                    placeholder="Image"
                                    value={values.image}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.image}
                                    touched={touched.image}
                                />

                                {/* <ImageInput
                                    id="image"
                                    placeholder="Image"
                                    url={values.image || ''}
                                    setFieldValue={setFieldValue}
                                    fieldName={'image'}
                                    styleClasses={styleClasses}
                                    error={errors.image}
                                    touched={touched.image}
                                    required={false}
                                /> */}

                                {/* Content */}
                                <CustomRichTextEditor
                                    id="content"
                                    placeholder="Content"
                                    required
                                    value={values.content ?? ""}
                                    onChange={(e) => setFieldValue("content", e.target.value)}
                                    onBlur={handleBlur}
                                    styleClasses={styleClasses}
                                    error={errors.content}
                                    touched={touched.content}
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

                                {/* email */}
                                <CustomMultiInputField 
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    values={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    
                                    styleClasses={styleClasses}
                                    error={errors.email}
                                    touched={touched.email}
                                />

                                {/* slug */}
                                <CustomFormField
                                    type="text"
                                    id="slug"
                                    placeholder="Slug is auto geneeted"
                                    value={values.slug}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled
                                    styleClasses={styleClasses}
                                    error={errors.slug}
                                    touched={touched.slug}
                                />

                                {/* featured */}
                                <CustomCheckedField
                                    id="featured"
                                    placeholder="Featured ?"
                                    required
                                    mode="boolean"
                                    value={values.featured}
                                    onChange={(val) => setFieldValue("featured", val)}
                                    onBlur={handleBlur}
                                    error={errors.featured as string}
                                    touched={touched.featured}
                                    styleClasses={styleClasses}
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
                                    onCancelHref="/services"
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

export default ServiceForm;