"use client"

import { updateCareerApplication } from "@/app/actions/career-application.actions";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { CareerApplication } from "@/types/careerapplication";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import * as Yup from "yup";

type CareerApplicationFormProps = {
  careerApplication: CareerApplication | null;
  sessionRole: string | undefined;
  currentCareerId: string;
  onChange?: () => void;
};

const CareerApplicationForm = ({
    careerApplication,
    sessionRole,
    currentCareerId,
    onChange
}: CareerApplicationFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");
    const [options, setOptions] = useState<{ id: string; title: string }[]>([]);
    const [nextOrder, setNextOrder] = useState<number>(0);

    console.log({sessionRole})

    const styleClasses = React.useMemo(
        () => ({
            parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
            labelClassName: "text-sm text-black font-semibold capitalize",
            inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
        }),[]
    );

    // ======== Initial Form Values ========
    const initialValues: CareerApplication = useMemo(
        () => ({
            id: careerApplication?.id ?? "",
            careerId: careerApplication?.careerId ?? "",
            full_name: careerApplication?.full_name ?? "",
            email: careerApplication?.email ?? "",
            mobile_number: careerApplication?.mobile_number ?? "",
            resume: careerApplication?.resume ?? "",
            status: careerApplication?.status ?? 1,
        }),
        [careerApplication, nextOrder, currentCareerId]
    );
    
    // ======== Validation ========
    const validationSchema = Yup.object({
        full_name: Yup.string().required("This field is mandatory"),
    });

    // ======== Handle Submit ========
    const handleSubmit = async (
        values: CareerApplication,
        { resetForm }: FormikHelpers<CareerApplication>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: CareerApplication = {
                careerId: values.careerId,
                full_name: values.full_name,
                email: values.email,
                mobile_number: values.mobile_number,
                resume: values.resume,
                status: values.status
            };
    
            let resp: any;
        
            // ======== Update ========
            if (values.id) {
                console.log({createPayload})
                resp = await updateCareerApplication(values.id, createPayload);
            }
    
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
    
            const saved: CareerApplication = resp?.data ?? resp;
        
            // ======== Success Toast ========
            toast({
                variant: "success",
                title: values.id ? "Menu Item Updated" : "Menu Item Created",
                description: values.id
                ? "Changes updated successfully."
                : "Changes saved successfully.",
            });
    
            // ✅ Always trigger re-fetch after success (create or update)
            console.log("✅ Triggering onChange after save/update");
            onChange?.();
        
            // ======== If Save & Close ========
            if (submitType === "save-close") {
                router.push("/menu-manager");
                return;
            }
        
            // ======== Refresh form with new ID if updated ========
            if (values.id) {
                resetForm({ values: { ...values, id: saved.id } });
            }
    
        } catch (error: any) {
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
        <>
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
                        {/* FORM START */}
                        <Form className="w-full">
                            <div className="grid gap-4 py-4">

                                {/* Career Id */}
                                <CustomFormField
                                    type="text"
                                    id="careerId"
                                    placeholder="Career Id"
                                    value={values.careerId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled
                                    styleClasses={styleClasses}
                                    error={errors.careerId}
                                    touched={touched.careerId}
                                />

                                {/* full Name */}
                                <CustomFormField
                                    type="text"
                                    id="full_name"
                                    placeholder="full Name"
                                    value={values.full_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled
                                    styleClasses={styleClasses}
                                    error={errors.full_name}
                                    touched={touched.full_name}
                                />

                                {/* Email */}
                                <CustomFormField
                                    type="text"
                                    id="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled
                                    styleClasses={styleClasses}
                                    error={errors.email}
                                    touched={touched.email}
                                />

                                {/* Mobile Number */}
                                <CustomFormField
                                    type="text"
                                    id="mobile_number"
                                    placeholder="Mobile Number"
                                    value={values.mobile_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled
                                    styleClasses={styleClasses}
                                    error={errors.mobile_number}
                                    touched={touched.mobile_number}
                                />

                                {/* resume */}
                                <CustomFormField
                                    type="text"
                                    id="resume"
                                    placeholder="resume"
                                    value={values.resume}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled
                                    styleClasses={styleClasses}
                                    error={errors.resume}
                                    touched={touched.resume}
                                />

                                <CustomSelectField
                                    id="status"
                                    placeholder="status"
                                    required={false}
                                    value={values.status} 
                                    onChange={(v) => setFieldValue('status', v)}
                                    onBlur={handleBlur}
                                    options={[
                                        { label: "Pending", value: 1 },
                                        { label: "Accepted", value: 2 },
                                        { label: "Rejected", value: 3 },
                                    ]}
                                    styleClasses={styleClasses}
                                    error={errors.status}
                                    touched={touched.status}
                                />

                                {/* Save Buttons */}
                                <FormActionsBtns
                                    onCancelHref={"/careers"}
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
        </>
    )
}

export default CareerApplicationForm;