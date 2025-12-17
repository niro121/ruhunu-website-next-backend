"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "formik";
import "quill/dist/quill.snow.css";

type StyleClasses = {
  parentDiv?: string;
  labelClassName?: string;
  inputClassName?: string;
};

interface Props {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: { target: { id: string; name: string; value: string } }) => void;
  onBlur: (e: { target: { id: string; name: string } }) => void;
  required?: boolean;
  disabled?: boolean;
  styleClasses?: StyleClasses;
  error?: string;
  touched?: boolean;
  height?: number;
}

export default function CustomRichTextEditor({
  id,
  placeholder = "",
  value = "",
  onChange,
  onBlur,
  required = false,
  disabled = false,
  styleClasses,
  error,
  touched,
  height = 240,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);

  // keep latest callbacks
  const onChangeRef = useRef(onChange);
  const onBlurRef = useRef(onBlur);
  useEffect(() => { onChangeRef.current = onChange }, [onChange]);
  useEffect(() => { onBlurRef.current = onBlur }, [onBlur]);

  const formats = useMemo(
    () => [
      "header",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "script",
      "align",
      "blockquote",
      "code-block",
      "link",
      "image",
      "color",
      "background",
      "indent",
    ],
    []
  );

  // Build toolbar with size dropdown + custom input
  const buildToolbar = () => {
    const el = document.createElement("div");
    el.className = "ql-toolbar ql-snow";

    el.innerHTML = `
      <span class="ql-formats">
        <select class="ql-header">
          <option selected></option>
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option value="6"></option>
        </select>
      </span>

      <span class="ql-formats">
        <select class="ql-size">
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px" selected>16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="30px">30px</option>
          <option value="36px">36px</option>
        </select>
        <input type="text" class="ql-custom-size" placeholder="px" style="width:50px;margin-left:5px;" />
      </span>

      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>

      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
      </span>

      <span class="ql-formats">
        <select class="ql-align"></select>
      </span>

      <span class="ql-formats">
        <button class="ql-blockquote"></button>
        <button class="ql-code-block"></button>
      </span>

      <span class="ql-formats">
        <button class="ql-link"></button>
        <button class="ql-image"></button>
      </span>

      <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>

      <span class="ql-formats">
        <button class="ql-clean"></button>
      </span>
    `;
    return el;
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      const Quill = (await import("quill")).default;

      // Register custom size + allow any px value
      const Size = Quill.import("attributors/style/size") as any;
      Size.whitelist = null;
      Quill.register(Size, true);

      const Color = Quill.import("attributors/style/color") as any;
      Color.whitelist = null;
      Quill.register(Color, true);

      const Background = Quill.import("attributors/style/background") as any;
      Background.whitelist = null;
      Quill.register(Background, true);

      if (!wrapperRef.current || !mounted) return;
      wrapperRef.current.innerHTML = "";

      const toolbar = buildToolbar();
      const editor = document.createElement("div");
      wrapperRef.current.appendChild(toolbar);
      wrapperRef.current.appendChild(editor);

      const quill = new Quill(editor, {
        theme: "snow",
        readOnly: !!disabled,
        formats,
        modules: {
          toolbar,
          history: { delay: 800, maxStack: 200, userOnly: true },
          clipboard: true,
        },
      });

      quill.container.style.height = `${height}px`;
      quill.root.style.height = "100%";
      quill.root.style.overflowY = "auto";

      if (value) quill.clipboard.dangerouslyPasteHTML(value);

      quill.on("text-change", () => {
        onChangeRef.current({ target: { id, name: id, value: quill.root.innerHTML || "" } });
      });

      quill.root.addEventListener("blur", () => {
        onBlurRef.current({ target: { id, name: id } });
      });

      quillRef.current = quill;

      // CUSTOM px size input
      const customSizeInput = wrapperRef.current.querySelector(
        ".ql-custom-size"
      ) as HTMLInputElement;
      customSizeInput?.addEventListener("change", () => {
        const val = customSizeInput.value;
        if (val) {
          quill.format("size", val);
          customSizeInput.value = "";
        }
      });
    })();

    return () => {
      mounted = false;
      quillRef.current = null;
      if (wrapperRef.current) wrapperRef.current.innerHTML = "";
    };
  }, [formats, height, id]);

  // sync external value
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const current = quill.root.innerHTML ?? "";
    if (value !== current) {
      const sel = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value || "");
      if (sel) quill.setSelection(sel.index, sel.length, "silent");
    }
  }, [value]);

  // toggle disabled
  useEffect(() => {
    if (quillRef.current) quillRef.current.enable(!disabled);
  }, [disabled]);

  const borderClass = error && touched ? "border-red-600" : "border-gray-300";
  const disabledMask = disabled ? "pointer-events-none opacity-70" : "";

  return (
    <div className={styleClasses?.parentDiv}>
      <Label htmlFor={id} className={styleClasses?.labelClassName || ""}>
        {placeholder}
        {required && <span className="text-red-600"> *</span>}
      </Label>

      <div className={`${styleClasses?.inputClassName} w-full`}>
        <div className={`rounded border ${borderClass} ${disabledMask}`}>
          <div ref={wrapperRef} />
        </div>

        <ErrorMessage
          name={id}
          component="div"
          className="invalid-feedback text-red-600 text-sm whitespace-pre-wrap mt-2"
        />
      </div>
    </div>
  );
}
