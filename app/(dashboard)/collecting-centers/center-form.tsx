"use client";

import { updateCareer } from "@/app/actions/career.actions";
import { createNewCenter, updateCenter } from "@/app/actions/center.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Center, CenterLocation } from "@/types/center";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type CenterFormProps = {
    center: Center | null;
    sessionRole?: string | undefined;
    order: number
};

const CenterForm = ({center,sessionRole,order}: CenterFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const initialValues: Center = useMemo(
        () => ({
            id: center?.id ?? "",
            area: center?.area ?? "",
            visibility: center?.visibility ?? false,
            centers: center?.centers ?? [
                { centerName: "", address: "", phone: "" },
            ],
        }),
        [center]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        area: Yup.string().required("Area is required"),
        centers: Yup.array().of(
        Yup.object({
            centerName: Yup.string().required("Center name is required"),
            address: Yup.string().required("Address is required"),
            phone: Yup.string().required("Phone is required"),
        })
        ),
    });
        
    // ========== submit form ==========
    const handleSubmit = async (
        values: Center,
        { resetForm }: FormikHelpers<Center>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Center = {
                area: values.area,
                visibility: values.visibility,
                centers: values.centers.map(c => ({
                    centerName: c.centerName,
                    address: c.address,
                    phone: c.phone
                }))
            }
            
            let resp: any;

            // ========== update record ==========
            if(values.id) {
                resp = await updateCenter(values.id, createPayload);
            }
                        
            // ========== create new ==========
            else {
                resp = await createNewCenter(createPayload as Center);
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
                        
            const saved: Center = resp?.data ?? resp;
            
            toast({
                variant: 'success',
                title: values.id ? 'Collecting Centers updated' : 'Collecting Centers created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })
            
            // if save and close
            if (submitType === 'save-close') {
                router.push('/collecting-centers');
            } else {
                if (!values.id) {
                    router.push(`/collecting-centers/${saved.id}`);
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

                            {/* Area */}
                            <CustomFormField
                                type="text"
                                id="area"
                                placeholder="Area"
                                value={values.area}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.area}
                                touched={touched.area}
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

                            {/* Centers list */}
                            <div className="space-y-4 px-3">
                                <h3 className="font-semibold text-lg">Center Locations</h3>

                                {values.centers.map((c, index) => (
                                    <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">

                                        <CustomFormField
                                            type="text"
                                            id={`centers.${index}.centerName`}
                                            placeholder="Center Name"
                                            value={c.centerName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            styleClasses={styleClasses}
                                            error={(errors.centers?.[index] as FormikErrors<CenterLocation>)?.centerName}
                                            touched={touched.centers?.[index]?.centerName}
                                        />

                                        <CustomFormField
                                            type="text"
                                            id={`centers.${index}.address`}
                                            placeholder="Address"
                                            value={c.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            styleClasses={styleClasses}
                                            error={(errors.centers?.[index] as FormikErrors<CenterLocation>)?.phone}
                                            touched={touched.centers?.[index]?.phone}
                                        />

                                        <CustomFormField
                                            type="text"
                                            id={`centers.${index}.phone`}
                                            placeholder="Phone"
                                            value={c.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            styleClasses={styleClasses}
                                            error={(errors.centers?.[index] as FormikErrors<CenterLocation>)?.phone}
                                            touched={touched.centers?.[index]?.phone}
                                        />

                                        <button
                                            type="button"
                                            className="text-red-500 text-sm border border-red-500 rounded px-5 py-2"
                                            onClick={() =>
                                                setFieldValue("centers", values.centers.filter((_, i) => i !== index))
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="text-blue-600 text-sm border border-blue-600 rounded px-5 py-2"
                                    onClick={() =>
                                        setFieldValue("centers", [
                                        ...values.centers,
                                        { centerName: "", address: "", phone: "" },
                                        ])
                                    }
                                >
                                    + Add Another Center
                                </button>
                            </div>

                            {/* Save Buttons */}
                            <FormActionsBtns
                                onCancelHref="/collecting-centers"
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

export default CenterForm;