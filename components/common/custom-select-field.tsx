"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Spinner } from "../icons"

/**
 * - value: can be number (e.g. DB id) or string (e.g. "10.00 PM")
 * - label: what the user sees in the dropdown
 */
interface Option {
  value: string | number
  label: string
}

interface CustomSelectFieldProps {
  id: string // Form field name (also used by Formik for errors via `name`)
  placeholder: string
  value: string | number | undefined | null // Current value from Formik (or parent). Can be number or string
  onChange: (value: string | number) => void // Called with the ORIGINAL type: number stays number, string stays string
  onBlur?: React.FocusEventHandler<any> // Pass Formik's handleBlur if want touched state to update on close
  disabled?: boolean
  required: boolean
  options: Option[]
  styleClasses?: { // Style hooks to keep consistent with text field 
    parentDiv: string
    labelClassName: string
    inputClassName: string
  }
  loading?: boolean
  emptyString?: string // Message to show when options are empty
  error?: string // Formik error
  touched?: boolean // Formik error
  emptyOptionLabel?: string // Example: emptyOptionLabel="All Theaters", emptyOptionValue="", For required forms
  emptyOptionValue?: string
  autoSelectFirst?: boolean // If true and there's no current value, we auto-select the first option on mount.
}

const CustomSelectField = ({
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required,
  options,
  styleClasses,
  loading = false,
  emptyString = "No options available",
  error,
  touched,
  emptyOptionLabel,
  emptyOptionValue = "",
  autoSelectFirst = false,
}: CustomSelectFieldProps) => {

  const EMPTY_SENTINEL = "__EMPTY__"

  // Radix Select works with strings internally, so we stringify here.
  const selectValue =
    (value === "" || value == null)
      ? (typeof emptyOptionLabel !== "undefined" ? EMPTY_SENTINEL : "")
      : String(value);

  // Map the selected string back to the ORIGINAL type using the options list.
  const handleValueChange = (selected: string) => {
    if (selected === EMPTY_SENTINEL) {
      onChange("");
      return;
    }
    const found = options.find((o) => String(o.value) === selected);
    onChange(found ? found.value : selected);
  };

  // when the dropdown closes, we mark it as "touched".
  const handleOpenChange = (open: boolean) => {
    if (!open && onBlur) {
      const evt = { target: { id, name: id } } as unknown as React.FocusEvent<any>
      onBlur(evt)
    }
  }

  // Auto-select the first option on mount if requested and no value is present.
  React.useEffect(() => {
    if (
      autoSelectFirst &&
      (value === undefined || value === null || value === "") &&
      options.length > 0
    ) {
      onChange(options[0].value)
    }
    // We only want this to run on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show red border only if required
  const borderClass = error && touched ? "border-red-600" : "border-gray-300"

  return (
    <div className={styleClasses?.parentDiv}>

      {/* If required show */}
      <Label className={styleClasses?.labelClassName}>
        {placeholder}
        {required && <span className="text-red-600"> *</span>}
      </Label>

      <div className={styleClasses?.inputClassName}>
        {loading ? (
          // If data is still loading, show a spinner.
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Select
            name={id}
            value={selectValue}
            onValueChange={handleValueChange}
            onOpenChange={handleOpenChange}
            disabled={disabled}
          >
            <SelectTrigger
              id={id}
              // focus styles and conditional border
              className={`select-span border ${borderClass} 
              focus:outline-none focus:ring-0 focus:ring-offset-0 
              focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
              data-[state=open]:ring-0 text-black w-full px-2`}
              aria-invalid={!!(error && touched)}
              aria-required={required}
            >
              {/* Placeholder is shown when value is empty string */}
              <SelectValue placeholder={placeholder} className="text-black"/>
            </SelectTrigger>

            <SelectContent className="!overflow-auto max-h-80 bg-white">

              {/* "empty" option */}
              {typeof emptyOptionLabel !== "undefined" && (
                <SelectItem value={EMPTY_SENTINEL} className="text-black">{emptyOptionLabel}</SelectItem>
              )}

              {/* Normal options */}
              {options.length ? (
                options.map((item) => (
                  <SelectItem key={String(item.value)} value={String(item.value)} className="text-black">
                    {item.label}
                  </SelectItem>
                ))
              ) : (
                // If there are no options, show a simple text row
                <div className="text-sm p-2 text-black">{emptyString}</div>
              )}
            </SelectContent>
          </Select>
        )}

        {/* Inline error message under the field */}
        {error && touched ? (
          <div className="text-red-600 text-sm whitespace-pre-wrap pt-1 sm:pt-0">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CustomSelectField