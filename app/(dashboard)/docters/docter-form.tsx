"use client"

import { createNewDocter, updateDocter } from "@/app/actions/docter.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomRichTextEditor from "@/components/common/custom-rich-text-editor";
import CustomSelectField from "@/components/common/custom-select-field";
import CustomMultiSelectField from "@/components/common/CustomMultiSelectField";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import ImageInput from "@/components/common/image-input/ImageInput";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Docter } from "@/types/docter";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";

type DocterFormProps = {
    docter: Docter | null;
    sessionRole: string | undefined;
    order: number;
    branches: {id:string,name: string}[]
    specialitis: {id:string,name: string}[]
};

type Option = {
    label: string;
    value: string;
};

const DocterForm = ({docter,sessionRole,order,branches,specialitis}: DocterFormProps) => {
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");

    const title : Option[] = [
        { label: 'MR.', value: 'MR.' },
        { label: 'MRS.', value: 'MRS.' },
        { label: 'MISS.', value: 'MISS.' },
        { label: 'MS.', value: 'MS.' },
        { label: `Ma'am`, value: `Ma'am` },
        { label: 'DR.', value: 'DR.' },
        { label: 'DR.(MRS)', value: 'DR.(MRS)' },
        { label: 'DR.(MS)', value: 'DR.(MS)' },
        { label: 'DR.(MISS)', value: 'DR.(MISS)' },
        { label: 'PROF.', value: 'PROF.' },
        { label: 'PROF.(MRS)', value: 'PROF.(MRS)' },
        { label: 'MASTER.', value: 'MASTER.' },
        { label: 'BABY.', value: 'BABY.' },
        { label: 'REV.', value: 'REV.' },
        { label: 'RT.REV.', value: 'RT.REV.' },
        { label: 'HON', value: 'HON.' },
        { label: 'RT.HON.', value: 'RT.HON.' },
        { label: 'OTHER', value: 'OTHER.' },
    ];

    const specialitisData : Option[] = specialitis.map((speciality) => ({
        label: speciality.name,
        value: speciality.id,
    }))

    const branchesData: Option[] = branches.map((branch) => ({
        label: branch.name,
        value: branch.id,
    }));

    const initialValues: Docter = useMemo(
        () => ({
            id: docter?.id ?? "",
            title: docter?.title ?? "",
            name: docter?.name ?? "",
            image: docter?.image ?? "",
            visibility: docter?.visibility ?? false,
            speciality: docter?.speciality ?? "",
            branch: docter?.branch ?? [],
            code: docter?.code ?? "",
            order: typeof docter?.order === 'number' ? docter.order : order,
            phone: docter?.phone ?? "",
            mobile: docter?.mobile ?? "",
            address1: docter?.address1 ?? "",
            address2: docter?.address2 ?? "",
            city: docter?.city ?? "",
            regNumber: docter?.regNumber ?? "",
            qualification: docter?.qualification ?? "",
            referralCharge: typeof docter?.referralCharge === 'number' ? docter.referralCharge : 0,
            sessionNoPrefix: docter?.sessionNoPrefix ?? "",
            featured: docter?.featured ?? false,
            laboratory: docter?.laboratory ?? false,
            advanceBooking: docter?.advanceBooking ?? false
        }),
        [docter]
    );

    // ========== form validation ==========
    const validationSchema = Yup.object({
        name: Yup.string().required("This field is mandatory"),
        visibility: Yup.boolean().required("This field is mandatory"),
    });

    // ========== submit form ==========
    const handleSubmit = async (
        values: Docter,
        { resetForm }: FormikHelpers<Docter>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        try {
            const createPayload: Docter = {
                title: values.title,
                name: values.name,
                image: values.image,
                visibility: values.visibility,
                speciality: values.speciality,
                branch: values.branch,
                code: values.code,
                order: values.order,
                phone: values.phone,
                mobile: values.mobile,
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                regNumber: values.regNumber,
                qualification: values.qualification,
                referralCharge: values.referralCharge,
                sessionNoPrefix: values.sessionNoPrefix,
                featured: values.featured,
                laboratory: values.laboratory,
                advanceBooking: values.advanceBooking
            }

            let resp: any;

            // ========== update record ==========
            if(values.id) {
                resp = await updateDocter(values.id, createPayload);
            }

            // ========== create new ==========
            else {
                resp = await createNewDocter(createPayload as Docter);
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

            const saved: Docter = resp?.data ?? resp;

            toast({
                variant: 'success',
                title: values.id ? 'Docter updated' : 'Docter created',
                description: values.id
                    ? 'Changes updated successfully.'
                    : 'Changes saved successfully.'
            })

            // if save and close
            if (submitType === 'save-close') {
                router.push('/docters');
            } else {
                if (!values.id) {
                    router.push(`/docters/${saved.id}`);
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

                                {/* title */}
                                <CustomSelectField
                                    id="title"
                                    placeholder="Title"
                                    required={false}
                                    value={values.title}
                                    onChange={(v) => setFieldValue('title', v)}
                                    onBlur={handleBlur}
                                    options={title}
                                    styleClasses={styleClasses}
                                    error={errors.title}
                                    touched={touched.title}
                                />

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

                                {/* Speciality */}
                                <CustomSelectField
                                    id="speciality"
                                    placeholder="Speciality"
                                    required={false}
                                    value={values.speciality}
                                    onChange={(v) => setFieldValue('speciality', v)}
                                    onBlur={handleBlur}
                                    options={specialitisData}
                                    styleClasses={styleClasses}
                                    error={errors.speciality}
                                    touched={touched.speciality}
                                />

                                {/* Branch */}
                                <CustomMultiSelectField
                                    id="branch"
                                    placeholder="Branch"
                                    required={false}
                                    value={values.branch}
                                    onChange={(v) => setFieldValue('branch', v)}
                                    onBlur={handleBlur}
                                    options={branchesData}
                                    styleClasses={styleClasses}
                                    error={typeof errors.branch === "string" ? errors.branch : undefined}
                                    touched={touched.branch}
                                />

                                {/* Code */}
                                <CustomFormField
                                    type="text"
                                    id="code"
                                    placeholder="Code"
                                    value={values.code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.code}
                                    touched={touched.code}
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
                                />

                                {/* Mobile */}
                                <CustomFormField
                                    type="text"
                                    id="mobile"
                                    placeholder="Mobile"
                                    value={values.mobile}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.mobile}
                                    touched={touched.mobile}
                                />

                                {/* Address 1 */}
                                <CustomFormField
                                    type="text"
                                    id="address1"
                                    placeholder="Address"
                                    value={values.address1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.address1}
                                    touched={touched.address1}
                                />

                                {/* Address 2 */}
                                <CustomFormField
                                    type="text"
                                    id="address2"
                                    placeholder="Address"
                                    value={values.address2}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.address2}
                                    touched={touched.address2}
                                />

                                {/* City */}
                                <CustomFormField
                                    type="text"
                                    id="city"
                                    placeholder="City"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.city}
                                    touched={touched.city}
                                />

                                {/* RegNumber */}
                                <CustomFormField
                                    type="text"
                                    id="regNumber"
                                    placeholder="Register Number"
                                    value={values.regNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.regNumber}
                                    touched={touched.regNumber}
                                />

                                {/* Qualification */}
                                <CustomRichTextEditor
                                    id="qualification"
                                    placeholder="Qualification"
                                    value={values.qualification}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.qualification}
                                    touched={touched.qualification}
                                />

                                {/* ReferralCharge */}
                                <CustomFormField
                                    type="number"
                                    id="referralCharge"
                                    placeholder="Referral Charge"
                                    value={values.referralCharge}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.referralCharge}
                                    touched={touched.referralCharge}
                                />

                                {/* SessionNoPrefix */}
                                <CustomFormField
                                    type="text"
                                    id="sessionNoPrefix"
                                    placeholder="Session No Prefix"
                                    value={values.sessionNoPrefix}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    styleClasses={styleClasses}
                                    error={errors.sessionNoPrefix}
                                    touched={touched.sessionNoPrefix}
                                />

                                {/* Featured */}
                                <CustomCheckedField
                                    id="featured"
                                    placeholder="Featured"
                                    required
                                    mode="boolean"
                                    value={values.featured}
                                    onChange={(val) => setFieldValue("featured", val)}
                                    onBlur={handleBlur}
                                    error={errors.featured as string}
                                    touched={touched.featured}
                                    styleClasses={styleClasses}
                                />

                                {/* Laboratory */}
                                <CustomCheckedField
                                    id="laboratory"
                                    placeholder="Laboratory"
                                    required
                                    mode="boolean"
                                    value={values.laboratory}
                                    onChange={(val) => setFieldValue("laboratory", val)}
                                    onBlur={handleBlur}
                                    error={errors.laboratory as string}
                                    touched={touched.laboratory}
                                    styleClasses={styleClasses}
                                />

                                {/* advanceBooking */}
                                <CustomCheckedField
                                    id="advanceBooking"
                                    placeholder="Advance Booking"
                                    required
                                    mode="boolean"
                                    value={values.advanceBooking}
                                    onChange={(val) => setFieldValue("advanceBooking", val)}
                                    onBlur={handleBlur}
                                    error={errors.advanceBooking as string}
                                    touched={touched.advanceBooking}
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
                                    onCancelHref="/docters"
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

export default DocterForm;