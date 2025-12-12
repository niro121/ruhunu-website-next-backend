"use client"

import { createNewApplication, updateApplication } from "@/app/actions/nts-application.actions";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { NtsApplication } from "@/types/ntsapplication";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type ApplicationFormProps = {
    application: NtsApplication | null;
    sessionRole: string | undefined;
    order: number;
};

const ApplicationForm = ({ application, sessionRole, order }: ApplicationFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: NtsApplication = useMemo(
        () => ({
            id: application?.id ?? "",
            title: application?.title ?? "",
            full_name: application?.full_name ?? "",
            date_of_birth: application?.date_of_birth ?? new Date(),
            age: typeof application?.age === "number" ? application.age : 0,
            gender: application?.gender ?? "",
            address1: application?.address1 ?? "",
            address2: application?.address2 ?? null,
            phone: application?.phone ?? "",
            nic: application?.nic ?? "",
            email: application?.email ?? "",
            status: typeof application?.status === "number" ? application.status : 0,
            createdAt: application?.createdAt ?? new Date(),
            updatedAt: application?.updatedAt ?? new Date(),
        }),
        [application]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        full_name: Yup.string().required("This field is mandatory"),
        date_of_birth: Yup.date().required("This field is mandatory"),
        gender: Yup.string().required("This field is mandatory"),
        phone: Yup.string().required("This field is mandatory"),
        nic: Yup.string().required("This field is mandatory"),
        email: Yup.string().email("Invalid email").required("This field is mandatory"),
    });

    // ========== submit form ==========
    const handleSubmit = async (
        values: NtsApplication,
        { resetForm }: FormikHelpers<NtsApplication>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: NtsApplication = {
                title: values.title,
                full_name: values.full_name,
                date_of_birth: values.date_of_birth,
                age: values.age,
                gender: values.gender,
                address1: values.address1,
                address2: values.address2,
                phone: values.phone,
                nic: values.nic,
                email: values.email,
                status: values.status,
                createdAt: values.createdAt,
                updatedAt: new Date(),
            };

            let resp: any;

            // ========== update record ==========
            if (values.id) {
                resp = await updateApplication(values.id, createPayload);
            }

            // ========== create new ==========
            else {
                resp = await createNewApplication(createPayload as NtsApplication);
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

            const saved: NtsApplication = resp?.data ?? resp;

            toast({
                variant: "success",
                title: values.id ? "Application updated" : "Application created",
                description: values.id
                    ? "Changes updated successfully."
                    : "Changes saved successfully.",
            });

            // if save and close
            if (submitType === "save-close") {
                router.push("/nts");
            } else {
                if (!values.id) {
                    router.push(`/nts/${saved.id}`);
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
    };

    const styleClasses = {
        parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
        labelClassName: "text-sm text-black font-semibold capitalize",
        inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
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
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
                <Card className="border shadow-sm">
                    <Form className="w-full">
                        <div className="grid gap-4 py-4">
                            {/* title */}
                            <CustomSelectField
                                id="title"
                                placeholder="Title"
                                required={false}
                                value={values.title}
                                onChange={(v) => setFieldValue("title", v)}
                                onBlur={handleBlur}
                                options={[
                                    { label: "Mr", value: "MR" },
                                    { label: "Mrs", value: "MRS" },
                                    { label: "Ms", value: "MS" },
                                ]}
                                styleClasses={styleClasses}
                                error={errors.title}
                                touched={touched.title}
                                disabled
                            />

                            {/* Full Name */}
                            <CustomFormField
                                type="text"
                                id="full_name"
                                placeholder="Full Name"
                                value={values.full_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.full_name}
                                touched={touched.full_name}
                                disabled
                            />

                            {/* Date of Birth */}
                            <CustomFormField
                                type="date"
                                id="date_of_birth"
                                placeholder="Date of Birth"
                                value={
                                    values.date_of_birth
                                        ? new Date(values.date_of_birth).toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.date_of_birth as unknown as string}
                                touched={touched.date_of_birth as unknown as boolean}
                                disabled
                            />

                            {/* Age */}
                            <CustomFormField
                                type="number"
                                id="age"
                                placeholder="Age"
                                value={values.age}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.age}
                                touched={touched.age}
                                disabled
                            />

                            {/* Gender */}
                            <CustomSelectField
                                id="gender"
                                placeholder="Gender"
                                required
                                value={values.gender}
                                onChange={(v) => setFieldValue("gender", v)}
                                onBlur={handleBlur}
                                options={[
                                    { label: "Male", value: "Male" },
                                    { label: "Female", value: "Female" },
                                    { label: "Other", value: "Other" },
                                ]}
                                styleClasses={styleClasses}
                                error={errors.gender}
                                touched={touched.gender}
                                disabled
                            />

                            {/* Address 1 */}
                            <CustomFormField
                                type="text"
                                id="address1"
                                placeholder="Address Line 1"
                                value={values.address1}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.address1}
                                touched={touched.address1}
                                disabled
                            />

                            {/* Address 2 */}
                            <CustomFormField
                                type="text"
                                id="address2"
                                placeholder="Address Line 2"
                                value={values.address2 ?? ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required={false}
                                styleClasses={styleClasses}
                                error={errors.address2}
                                touched={touched.address2}
                                disabled
                            />

                            {/* Phone */}
                            <CustomFormField
                                type="text"
                                id="phone"
                                placeholder="Phone"
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.phone}
                                touched={touched.phone}
                                disabled
                            />

                            {/* NIC */}
                            <CustomFormField
                                type="text"
                                id="nic"
                                placeholder="NIC"
                                value={values.nic}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.nic}
                                touched={touched.nic}
                                disabled
                            />

                            {/* Email */}
                            <CustomFormField
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.email}
                                touched={touched.email}
                                disabled
                            />

                            {/* Status */}
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
                                onCancelHref="/nts"
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
    );
};

export default ApplicationForm;
