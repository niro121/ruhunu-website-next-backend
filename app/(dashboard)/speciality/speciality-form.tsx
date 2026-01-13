"use client"

import { createNewSpeciality, updateSpeciality } from "@/app/actions/speciality.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Speciality } from "@/types/speciality";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type SpecialityFormProps = {
    speciality: Speciality | null;
    sessionRole: string | undefined;
    order: number;
};

const SpecialityForm = ({speciality,sessionRole,order}: SpecialityFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: Speciality = useMemo(
        () => ({
            id: speciality?.id ?? "",
            name: speciality?.name ?? "",
            code: speciality?.code ?? "",
            description: speciality?.description ?? "",
            visibility: speciality?.visibility ?? false
        }),
        [speciality]
    );

    const validationSchema = Yup.object({
        name: Yup.string().required("This field is mandatory"),
        visibility: Yup.boolean().required("This field is mandatory"),
    });

    // ========== submit form ==========
    const handleSubmit = async (
        values: Speciality,
        { resetForm }: FormikHelpers<Speciality>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Speciality = {
                name: values.name,
                code: values.code,
                description: values.description,
                visibility: values.visibility
            }

            let resp: any;

            // ========== update record ==========
            if(values.id) {
                resp = await updateSpeciality(values.id, createPayload);
            }
                        
            // ========== create new ==========
            else {
                resp = await createNewSpeciality(createPayload as Speciality);
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

            const saved: Speciality = resp?.data ?? resp;
                        
            toast({
                variant: 'success',
                title: values.id ? 'Speciality updated' : 'Speciality created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })
                        
            // if save and close
            if (submitType === 'save-close') {
                router.push('/speciality');
            } else {
                if (!values.id) {
                    router.push(`/speciality/${saved.id}`);
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

                            {/* Code */}
                            <CustomFormField
                                type="text"
                                id="code"
                                placeholder="Code (Auto Generated)"
                                value={values.code}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required={false}
                                disabled
                                styleClasses={styleClasses}
                                error={errors.code}
                                touched={touched.code}
                            />

                            {/* description */}
                            <CustomRichTextEditor
                                id="description"
                                placeholder="Description"
                                required={false}
                                value={values.description ?? ""}
                                onChange={(e) => setFieldValue("description", e.target.value)}
                                onBlur={handleBlur}
                                styleClasses={styleClasses}
                                error={errors.description}
                                touched={touched.description}
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
                                onCancelHref="/speciality"
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

export default SpecialityForm;