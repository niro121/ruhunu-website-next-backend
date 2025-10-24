"use client";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import CustomFormField from "@/components/common/form-field";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import { useToast } from "@/components/hooks/use-toast";
import { NtsApplicationManager } from "@/types/ntsapplication-manager";
import { useRouter } from "next/navigation";
import {
  createNewApplication,
  updateApplication,
} from "@/app/actions/ntsapplication.actions";

type NtsApplicationFormProps = {
  application: NtsApplicationManager | null;
  sessionRole: string | undefined;
  order?: number;
};

const NtsApplicationForm = ({
  application,
  sessionRole,
}: NtsApplicationFormProps) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const submitTypeRef = React.useRef<"save" | "save-close">("save");

  const initialValues: NtsApplicationManager = useMemo(
    () => ({
      id: application?.id ?? "",
      title: application?.title ?? "",
      full_name: application?.full_name ?? "",
      date_of_birth: application?.date_of_birth ?? new Date(),
      age: application?.age ?? 0,
      gender: application?.gender ?? "",
      address1: application?.address1 ?? "",
      address2: application?.address2 ?? "",
      phone: application?.phone ?? "",
      nic: application?.nic ?? "",
      email: application?.email ?? "",
      status: application?.status ?? 1,
    }),
    [application]
  );

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    full_name: Yup.string().required("Full name is required"),
    date_of_birth: Yup.date().required("Date of birth is required"),
    age: Yup.number().required("Age is required").positive().integer(),
    gender: Yup.string().required("Gender is required"),
    address1: Yup.string().required("Address is required"),
    phone: Yup.string().required("Phone number is required"),
    nic: Yup.string().required("NIC is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (
    values: NtsApplicationManager,
    { resetForm }: FormikHelpers<NtsApplicationManager>,
    submitType: "save" | "save-close" = "save"
  ) => {
    setLoading(true);
    try {
      const payload: NtsApplicationManager = {
        ...values,
        status: 1,
      };

      let resp: any;
      if (values.id) {
        resp = await updateApplication(values.id, payload);
      } else {
        resp = await createNewApplication(payload);
      }

      if (resp?.isError) {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Please check the form and try again.",
        });
        setLoading(false);
        return;
      }

      const saved: NtsApplicationManager = resp?.data ?? resp;
      toast({
        variant: "success",
        title: values.id ? "Application updated" : "Application created",
        description: values.id
          ? "Changes updated successfully."
          : "Application saved successfully.",
      });

      if (submitType === "save-close") {
        router.push("/applications");
      } else if (!values.id) {
        router.push(`/applications/${saved.id}`);
      }

      resetForm({ values: { ...values, id: saved.id } });
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
            <div className="grid gap-4 py-6 px-4 bg-[#f5fbff] rounded-xl">
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
                Application Form
              </h2>

              {/* Title */}
              <CustomSelectField
                id="title"
                placeholder="Title"
                required
                value={values.title}
                onChange={(v) => setFieldValue("title", v)}
                onBlur={handleBlur}
                options={[
                  { label: "Mr.", value: "Mr" },
                  { label: "Mrs.", value: "Mrs" },
                  { label: "Miss", value: "Miss" },
                  { label: "Dr.", value: "Dr" },
                ]}
                styleClasses={styleClasses}
                error={errors.title}
                touched={touched.title}
              />

              {/* Full Name */}
              <CustomFormField
                type="text"
                id="full_name"
                placeholder="Name"
                value={values.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                error={errors.full_name}
                touched={touched.full_name}
              />

              {/* Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-3">
                <CustomFormField
                  type="text"
                  id="dob_day"
                  placeholder="Date"
                  value={
                    values.date_of_birth
                      ? String(new Date(values.date_of_birth).getDate())
                      : ""
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={false}
                />

                <CustomFormField
                  type="text"
                  id="dob_month"
                  placeholder="Month"
                  value={
                    values.date_of_birth
                      ? String(new Date(values.date_of_birth).getMonth() + 1)
                      : ""
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={false}
                />

                <CustomFormField
                  type="text"
                  id="dob_year"
                  placeholder="Year"
                  value={
                    values.date_of_birth
                      ? String(new Date(values.date_of_birth).getFullYear())
                      : ""
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={false}
                />
              </div>

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
              />

              {/* Address */}
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
              />
              <CustomFormField
                type="text"
                id="address2"
                placeholder="Address Line 2"
                value={values.address2}
                onChange={handleChange}
                onBlur={handleBlur}
                styleClasses={styleClasses}
                required={false}
              />
              <div className="grid grid-cols-2 gap-4 px-3">
                <CustomFormField
                  type="text"
                  id="city"
                  placeholder="City"
                  value={""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={false}
                />
                <CustomFormField
                  type="text"
                  id="country"
                  placeholder="Country"
                  value={""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={false}
                />
              </div>

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
              />

              {/* Buttons */}
              <FormActionsBtns
                onCancelHref="/applications"
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

export default NtsApplicationForm;
