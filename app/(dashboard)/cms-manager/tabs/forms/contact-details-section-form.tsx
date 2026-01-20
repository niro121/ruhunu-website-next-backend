"use client"

import { createNewSection, getNextOrder, updateSection } from "@/app/actions/section.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import CustomMultiInputField from "@/components/common/form-multi-input-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Section } from "@/types/section"
import { Form, Formik, FormikHelpers, getIn } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import * as Yup from "yup";

type ContactDetailsSection = Omit<Section, ""> & {
    data: {
        phoneNumber: string[];
        email: string[];
        address: string[];
        paddingtop: number;
        paddingbottom: number;
    }
}

type ContactDetailsProps = {
    pageId: string | null;
    content: ContactDetailsSection | null;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onUpdated: (page: any) => void;
}

const ContactDetailsForm = ({
    pageId,
    content,
    styleClasses,
    sessionRole,
    onUpdated,
}: ContactDetailsProps) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const submitTypeRef = React.useRef<"save" | "save-close">("save");
    const [nextOrder, setNextOrder] = useState<number>(1); 
        
    useEffect(() => {    
        const fetchOrder = async () => {
            try {
                const order = await getNextOrder(pageId || '');
                setNextOrder(order);
            } catch (error) {
                console.error("Error fetching next order:", error);
            }
        };
        if (!content && pageId) fetchOrder();
    }, [content, pageId]);

    // Initial Values
    const initialValues: ContactDetailsSection = useMemo(
        () => ({
            id: content?.id || "",
            type: "Contact-Banner",
            layout: content?.layout || 1,
            order: content?.order || nextOrder,
            data: {
                phoneNumber: content?.data.phoneNumber || [],
                email: content?.data.email || [],
                address: content?.data.address || [],
                paddingtop:content?.data.paddingtop || 0,
                paddingbottom:content?.data.paddingbottom || 0,
            },
            pageId: pageId || "",
            visibility: content?.visibility || false,
        }),[content,nextOrder]
    );

    // Validation Schema
    const validationSchema = Yup.object({
        data: Yup.object({
            // title: Yup.string().required("Title is required"),
            // webImage: Yup.string().required("Title is required"),
            // mobileImage: Yup.string().required("Title is required"),
        }),
        order: Yup.number().required("Order is required"),
    });

    // Submit
    const handleSubmit = async (
        values: ContactDetailsSection,
        { resetForm }: FormikHelpers<ContactDetailsSection>,
        submitType: "save" | "save-close" = "save"
    ) => {
        setLoading(true);
        
        try {
            const createPayload: Section = {
                type: values.type,
                layout: values.layout,
                order: values.order,
                data: {
                    phoneNumber: values.data.phoneNumber,
                    email: values.data.email,
                    address: values.data.address,
                    paddingtop: values.data.paddingtop,
                    paddingbottom: values.data.paddingbottom,
                },
                visibility: values.visibility,
                pageId: pageId || ""
            };

            let resp: any;
                
            if (values.id) resp = await updateSection(values.id, createPayload);
            else resp = await createNewSection(createPayload as Section);
                                
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
                                            
            const saved: Section = resp?.data ?? resp;
                            
            toast({
                variant: "success",
                title: values.id ? "Section updated" : "Section created",
                description: values.id
                ? "Changes updated successfully."
                : "Changes saved successfully.",
            });
                            
            if (submitType === "save-close") {
                router.push("/cms-manager");
                return;
            }
                                
            if (!values.id) {
                resetForm({ values: { ...values, id: saved.id } });
            } else {
                onUpdated(saved);
                resetForm({ values: { ...values, id: saved.id } });
            }
                                
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

                            {/* PhoneNumber */}
                            <CustomMultiInputField 
                                type="text"
                                id="data.phoneNumber"
                                placeholder="Phone"
                                values={values.data.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.phoneNumber")}
                                touched={getIn(touched, "data.phoneNumber")}
                            />

                            <CustomMultiInputField 
                                type="email"
                                id="data.email"
                                placeholder="Email"
                                values={values.data.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.email")}
                                touched={getIn(touched, "data.email")}
                            />

                            <CustomMultiInputField 
                                type="text"
                                id="data.address"
                                placeholder="Address"
                                values={values.data.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.address")}
                                touched={getIn(touched, "data.address")}
                            />
                            
                            {/* Layout */}
                            <CustomSelectField
                                id="layout"
                                placeholder="Layout"
                                value={values.layout}
                                onChange={(v) => setFieldValue("layout", v)}
                                options={[
                                    { label: "Layout 1", value: 1 },
                                    { label: "Layout 2", value: 2 },
                                ]}
                                styleClasses={styleClasses}
                                required={false}
                            />

                            {/* Padding Top */}
                            <CustomFormField
                                type="number"
                                id="data.paddingtop"
                                placeholder="Padding Top"
                                value={values.data.paddingtop}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.paddingtop")}
                                touched={getIn(touched, "data.paddingtop")}
                            />

                            {/* Padding Bottom */}
                            <CustomFormField
                                type="number"
                                id="data.paddingbottom"
                                placeholder="Padding Bottom"
                                value={values.data.paddingbottom}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={getIn(errors, "data.paddingbottom")}
                                touched={getIn(touched, "data.paddingbottom")}
                            />

                            {/* Order */}
                            <CustomFormField
                                type="number"
                                id="order"
                                placeholder="Order"
                                value={values.order}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                styleClasses={styleClasses}
                                error={errors.order}
                                touched={touched.order}
                            />
                            
                            {/* Visibility */}
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
                                                            
                            {/* Actions */}
                            <FormActionsBtns
                                onCancelHref="/cms-manager"
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
    )
}

export default ContactDetailsForm