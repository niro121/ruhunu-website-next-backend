"use client"

import React from "react"
import { FieldArray, ErrorMessage } from "formik"
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
import { Plus, Minus } from "lucide-react"

interface CustomMultiInputFieldProps {
  id: string
  type?: string
  placeholder: string
  values?: string[]
  onChange: (e: React.ChangeEvent<any>) => void
  onBlur: (e: React.FocusEvent<any>) => void
  required?: boolean
  disabled?: boolean
  styleClasses?: {
    parentDiv?: string
    labelClassName?: string
    inputClassName?: string
  }
  error?: string | string[]
  touched?: boolean | boolean[]
  setFieldValue?: (field: string, value: any) => void
}

const CustomMultiInputField: React.FC<CustomMultiInputFieldProps> = ({
  id,
  type = "text",
  placeholder,
  values = [],
  onChange,
  onBlur,
  required = false,
  disabled = false,
  styleClasses,
  error,
  touched,
  setFieldValue,
}) => {
  const labelText =
    placeholder?.charAt(0).toUpperCase() + placeholder.slice(1) || ""

  // ✅ Always show at least one input even if array is empty
  const safeValues = values.length > 0 ? values : [""]

  return (
    <div className={styleClasses?.parentDiv || "grid grid-cols-1 px-3 mb-2 w-full"}>
      {/* Label */}
      <Label htmlFor={id} className={styleClasses?.labelClassName || ""}>
        {labelText}
        {required && <span className="text-red-600"> *</span>}
      </Label>

      <FieldArray
        name={id}
        render={(arrayHelpers) => (
          <div className="flex flex-col gap-3 mt-2 !w-full col-span-3">
            {safeValues.map((val, index) => (
              <div
                key={index}
                className="flex items-center gap-2 !w-full max-w-full"
              >
                {/* Input field */}
                <Input
                  type={type}
                  id={`${id}.${index}`}
                  name={`${id}.${index}`}
                  value={val}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={`!w-full flex-1 p-2 border rounded outline-none transition-all ${
                    styleClasses?.inputClassName || ""
                  } ${
                    error && touched ? "border-red-600" : "border-gray-300"
                  } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />

                {/* Add/remove buttons */}
                {!disabled && (
                  <div className="flex items-center gap-1">
                    {safeValues.length > 1 && (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-all"
                      >
                        <Minus size={16} />
                      </button>
                    )}

                    {index === safeValues.length - 1 && (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                        className="bg-green-100 hover:bg-green-200 text-green-600 p-2 rounded-full transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Error message */}
            <ErrorMessage
              name={id}
              component="div"
              className="invalid-feedback text-red-600 text-sm whitespace-pre-wrap pt-1"
            />
          </div>
        )}
      />
    </div>
  )
}

export default CustomMultiInputField
