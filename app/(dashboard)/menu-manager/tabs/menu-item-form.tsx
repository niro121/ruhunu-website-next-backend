"use client";

import {
  createNewMenuItem,
  getAllMenuItemsNameId,
  getNextMenuItemOrder,
  updateMenuItems,
} from "@/app/actions/menuitem.actions";
import CustomCheckedField from "@/components/common/custom-checked-field";
import CustomSelectField from "@/components/common/custom-select-field";
import { FormActionsBtns } from "@/components/common/form-actions-btns";
import CustomFormField from "@/components/common/form-field";
import { useToast } from "@/components/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { MenuItem } from "@/types/menu-items";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";

type MenuItemFormProps = {
  menuItem: MenuItem | null;
  sessionRole: string | undefined;
  currentMenuId: string;
  onChange?: () => void;
};

const MenuItemForm = ({
  menuItem,
  sessionRole,
  currentMenuId,
  onChange,
}: MenuItemFormProps) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const submitTypeRef = React.useRef<"save" | "save-close">("save");
  const [options, setOptions] = useState<{ id: string; title: string }[]>([]);
  const [nextOrder, setNextOrder] = useState<number>(0);

  const styleClasses = React.useMemo(
    () => ({
      parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
      labelClassName: "text-sm text-black font-semibold capitalize",
      inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
    }),
    []
  );

  // ======== Fetch Next Order ========
  const NextOrder = async () => {
    try {
      const order = await getNextMenuItemOrder();
      setNextOrder(order);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    NextOrder();
  }, []);

  // ======== Fetch Parent Options ========
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAllMenuItemsNameId(currentMenuId);
        setOptions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentMenuId]);

  // ======== Initial Form Values ========
  const initialValues: MenuItem = useMemo(
    () => ({
      id: menuItem?.id ?? "",
      title: menuItem?.title ?? "",
      url: menuItem?.url ?? "",
      menuId: menuItem?.menuId ?? "",
      parentId: menuItem?.parentId ?? null,
      visible: menuItem?.visible ?? false,
      order: menuItem?.order ?? nextOrder,
    }),
    [menuItem, nextOrder, currentMenuId]
  );

  // ======== Validation ========
  const validationSchema = Yup.object({
    title: Yup.string().required("This field is mandatory"),
  });

  // ======== Handle Submit ========
  const handleSubmit = async (
    values: MenuItem,
    { resetForm }: FormikHelpers<MenuItem>,
    submitType: "save" | "save-close" = "save"
  ) => {
    setLoading(true);
    try {
      const createPayload: MenuItem = {
        title: values.title,
        url: values.url,
        menuId: currentMenuId,
        order: values.order,
        parentId: values.parentId || null,
        visible: values.visible,
      };

      let resp: any;

      // ======== Update ========
      if (values.id) {
        resp = await updateMenuItems(values.id, createPayload);
      }
      // ======== Create ========
      else {
        resp = await createNewMenuItem(createPayload as MenuItem);
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

      const saved: MenuItem = resp?.data ?? resp;

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
                
                {/* Title */}
                <CustomFormField
                  type="text"
                  id="title"
                  placeholder="Name"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  styleClasses={styleClasses}
                  error={errors.title}
                  touched={touched.title}
                />

                {/* URL */}
                <CustomFormField
                  type="text"
                  id="url"
                  placeholder="Url"
                  value={values.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  styleClasses={styleClasses}
                  error={errors.url}
                  touched={touched.url}
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

                {/* Parent Select */}
                <CustomSelectField
                    id="parentId"
                    placeholder="Parent"
                    required={false}
                    value={values.parentId ?? "none"} 
                    onChange={(v) => setFieldValue("parentId", v === "none" ? null : v)}
                    onBlur={handleBlur}
                    options={[
                        { label: "No Parent", value: "none" }, 
                        ...options.map((o) => ({
                        label: o.title,
                        value: o.id,
                        })),
                    ]}
                    styleClasses={styleClasses}
                    error={errors.parentId}
                    touched={touched.parentId}
                />


                {/* Visibility */}
                <CustomCheckedField
                  id="visible"
                  placeholder="Is Publish?"
                  required
                  mode="boolean"
                  value={values.visible}
                  onChange={(val) => setFieldValue("visible", val)}
                  onBlur={handleBlur}
                  error={errors.visible as string}
                  touched={touched.visible}
                  styleClasses={styleClasses}
                />

                {/* Save Buttons */}
                <FormActionsBtns
                  onCancelHref={"/menu-manager"}
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
  );
};

export default MenuItemForm;
