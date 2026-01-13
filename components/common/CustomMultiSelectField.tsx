"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select"
import { Spinner } from "../icons"

interface Option {
  value: string | number
  label: string
}

interface CustomMultiSelectFieldProps {
  id: string
  placeholder: string
  value: (string | number)[]
  onChange: (value: (string | number)[]) => void
  onBlur?: React.FocusEventHandler<any>
  disabled?: boolean
  required: boolean
  options: Option[]
  styleClasses?: {
    parentDiv: string
    labelClassName: string
    inputClassName: string
  }
  loading?: boolean
  emptyString?: string
  error?: string
  touched?: boolean
}

const CustomMultiSelectField = ({
  id,
  placeholder,
  value = [],
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
}: CustomMultiSelectFieldProps) => {
  const [open, setOpen] = React.useState(false)
  const selectedValues = value.map(String)

  // Toggle selection without closing
  const handleValueChange = (selected: string) => {
    const exists = selectedValues.includes(selected)
    if (exists) {
      onChange(value.filter((v) => String(v) !== selected))
    } else {
      const found = options.find((o) => String(o.value) === selected)
      if (found) {
        onChange([...value, found.value])
      }
    }
    // keep dropdown open
    setOpen(true)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen && onBlur) {
      const evt = { target: { id, name: id } } as unknown as React.FocusEvent<any>
      onBlur(evt)
    }
  }

  const borderClass = error && touched ? "border-red-600" : "border-gray-300"
  const selectedOptions = options.filter((o) =>
    selectedValues.includes(String(o.value))
  )

  return (
    <div className={`${styleClasses?.parentDiv} h-auto`}>
      <Label className={styleClasses?.labelClassName}>
        {placeholder}
        {required && <span className="text-red-600"> *</span>}
      </Label>

      <div className={`${styleClasses?.inputClassName} h-auto`}>
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Select
            value="" // Radix needs a value
            onValueChange={handleValueChange}
            onOpenChange={handleOpenChange}
            disabled={disabled}
            open={open} // controlled open
          >
            {/* Trigger */}
            <SelectTrigger
              id={id}
              className={`select-span border ${borderClass} w-full text-black px-2 py-2
                flex flex-wrap items-start min-h-[2.5rem] !h-auto bg-white rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              aria-invalid={!!(error && touched)}
            >
              {selectedOptions.length === 0 ? (
                <span className="text-gray-400">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-2 w-full">
                  {selectedOptions.map((item) => (
                    <span
                      key={String(item.value)}
                      className="bg-[#2ee57d] text-black text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              )}
            </SelectTrigger>

            {/* Dropdown content */}
            <SelectContent className="max-h-80 bg-white shadow-lg rounded-md p-1">
              {options.length ? (
                options.map((item) => {
                  const isSelected = selectedValues.includes(String(item.value))
                  return (
                    <SelectItem
                      key={String(item.value)}
                      value={String(item.value)}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 text-black"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="pointer-events-none"
                      />
                      {item.label}
                    </SelectItem>
                  )
                })
              ) : (
                <div className="text-sm p-2 text-black">{emptyString}</div>
              )}
            </SelectContent>
          </Select>
        )}

        {error && touched && (
          <div className="text-red-600 text-sm pt-1">{error}</div>
        )}
      </div>
    </div>
  )
}

export default CustomMultiSelectField
