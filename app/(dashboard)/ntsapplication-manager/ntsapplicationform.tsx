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
    status: Yup.number().required("Status is required"),
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
    labelClassName: "text-sm text-black font-semibold capitalize text-black",
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
        handleBlur,
        setFieldValue,
        submitForm,
      }) => (
        <Card className="border shadow-sm">
          <Form className="w-full">
            <div className="grid gap-4 py-6 px-4 rounded-xl">

              {/* Title */}
              <CustomSelectField
                id="title"
                placeholder="Title"
                required
                value={values.title}
                onChange={() => {}}
                onBlur={handleBlur}
                options={[
                  { label: "Mr.", value: "Mr" },
                  { label: "Mrs.", value: "Mrs" },
                  { label: "Miss", value: "Miss" },
                  { label: "Dr.", value: "Dr" },
                ]}
                styleClasses={styleClasses}
                disabled
              />

              {/* Full Name */}
              <CustomFormField
                type="text"
                id="full_name"
                placeholder="Name"
                value={values.full_name}
                onChange={() => {}}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                disabled
              />

              {/* Date of Birth */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 px-3">
                <CustomFormField
                  type="text"
                  id="dob_day"
                  placeholder="Date"
                  value={
                    values.date_of_birth
                      ? String(new Date(values.date_of_birth).getDate())
                      : ""
                  }
                  onChange={() => {}}
                  onBlur={handleBlur}
                  required={false}
                  disabled
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
                  onChange={() => {}}
                  onBlur={handleBlur}
                  required={false}
                  disabled
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
                  onChange={() => {}}
                  onBlur={handleBlur}
                  required={false}
                  disabled
                />
              </div>

              {/* Age */}
              <CustomFormField
                type="number"
                id="age"
                placeholder="Age"
                value={values.age}
                onChange={() => {}}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                disabled
              />

              {/* Gender */}
              <CustomSelectField
                id="gender"
                placeholder="Gender"
                required
                value={values.gender}
                onChange={() => {}}
                onBlur={handleBlur}
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
                styleClasses={styleClasses}
                disabled
              />

              {/* Address */}
              <CustomFormField
                type="text"
                id="address1"
                placeholder="Address Line 1"
                value={values.address1}
                onChange={() => {}}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                disabled
              />
              <CustomFormField
                type="text"
                id="address2"
                placeholder="Address Line 2"
                value={values.address2}
                onChange={() => {}}
                onBlur={handleBlur}
                styleClasses={styleClasses}
                required={false}
                disabled
              />

              {/* Phone */}
              <CustomFormField
                type="text"
                id="phone"
                placeholder="Phone"
                value={values.phone}
                onChange={() => {}}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                disabled
              />

              {/* NIC */}
              <CustomFormField
                type="text"
                id="nic"
                placeholder="NIC"
                value={values.nic}
                onChange={() => {}}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                disabled
              />

              {/* Email */}
              <CustomFormField
                type="email"
                id="email"
                placeholder="Email"
                value={values.email}
                onChange={() => {}}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                disabled
              />

              {/* Status */}
              <CustomSelectField
                id="status"
                placeholder="Status"
                required
                value={values.status}
                onChange={(v) => setFieldValue("status", Number(v))}
                onBlur={handleBlur}
                options={[
                  { label: "Accepted", value: 1 },
                  { label: "Pending", value: 2 },
                  { label: "Rejected", value: 3 },
                ]}
                styleClasses={styleClasses}
                error={errors.status}
                touched={touched.status}
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
