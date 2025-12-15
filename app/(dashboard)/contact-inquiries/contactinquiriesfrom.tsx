"use client";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomFormField from "@/components/common/form-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ContactInquiriesManager } from "@/types/contactinquiries";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import * as Yup from "yup";
import { updateOneContactInquiry } from "@/services/contactinquiries.service";
import CustomSelectField from "@/components/common/custom-select-field";

type ContactInquiriesFormProps = {
  contact: ContactInquiriesManager | null;
  sessionRole: string | undefined;
};

const ContactInquiriesForm = ({
  contact,
  sessionRole,
}: ContactInquiriesFormProps) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const submitTypeRef = React.useRef<"save" | "save-close">("save");

  // ======== Initial Values ========
  const initialValues: ContactInquiriesManager = useMemo(
    () => ({
      id: contact?.id ?? "",
      name: contact?.name ?? "",
      phone: contact?.phone ?? "",
      email: contact?.email ?? "",
      message: contact?.message ?? "",
      status: contact?.status ?? false,
    }),
    [contact]
  );

  // ======== Validation ========
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    message: Yup.string().required("Message is required"),
    status: Yup.boolean().required("Status is required"),
  });

  // ======== Submit Handler ========
  const handleSubmit = async (
    values: ContactInquiriesManager,
    { resetForm }: FormikHelpers<ContactInquiriesManager>,
    submitType: "save" | "save-close" = "save"
  ) => {
    setLoading(true);
    try {
      const payload: ContactInquiriesManager = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        message: values.message,
        status: values.status,
      };

      let resp: any;

      if (values.id) {
        resp = await updateOneContactInquiry(values.id, payload);
      } else {
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

      const saved: ContactInquiriesManager = resp?.data ?? resp;

      toast({
        variant: "success",
        title: values.id ? "Inquiry updated" : "Inquiry created",
        description: "Changes saved successfully.",
      });

      if (submitType === "save-close") {
        router.push("/contact-inquiries");
      } else if (!values.id) {
        router.push(`/contact-inquiries/${saved.id}`);
      }

      resetForm({ values: { ...values, id: saved.id } });
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

  const styleClasses = {
    parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
    labelClassName: "text-sm text-black font-semibold capitalize",
    inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
  };

  // ======== FORM UI ========
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

              {/* Phone */}
              <CustomFormField
                type="text"
                id="phone"
                placeholder="Phone Number"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                error={errors.phone}
                touched={touched.phone}
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

              {/* Message */}
              <CustomFormField
                type="textarea"
                id="message"
                placeholder="Message"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                styleClasses={styleClasses}
                error={errors.message}
                touched={touched.message}
              />

              {/* Status */}
              <CustomSelectField
                id="status"
                placeholder="Select Status"
                required
                value={values.status ? "true" : "false"}
                options={[
                  { label: "Not Contacted", value: "false" },
                  { label: "Contacted", value: "true" },
                ]}
                onChange={(val) => setFieldValue("status", val === "true")}
                onBlur={handleBlur}
                error={errors.status as string}
                touched={touched.status}
                styleClasses={styleClasses}
              />

              {/* Form Actions */}
              <FormActionsBtns
                onCancelHref="/contact-inquiries"
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

export default ContactInquiriesForm;
