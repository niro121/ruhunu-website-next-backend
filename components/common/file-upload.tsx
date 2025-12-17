'use client'

import { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ErrorMessage, FormikErrors, FormikTouched } from "formik";
import toast from "react-hot-toast";

interface FileUploadProps {
    id: string;
    placeholder: string;
    multiple?: boolean;
    allow?: string;
    disabled?: boolean;

    // Formik
    setFieldValue: (field: string, value: any) => void;
    fieldName: string;

    styleClasses?: {
        parentDiv?: string;
        labelClassName?: string;
        inputClassName?: string;
    };

    // The initial value from Formik
    value?: string;

    error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
    touched?: boolean | FormikTouched<any> | FormikTouched<any>[];
}

const FileUpload = ({
    id,
    placeholder,
    multiple = false,
    allow,
    disabled = false,
    setFieldValue,
    fieldName,
    styleClasses,
    value,
    error,
    touched,
}: FileUploadProps) => {

    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    // Show initial Formik value in preview
    useEffect(() => {
        if (value) {
            setFileUrl(value);
            const parts = value.split('/');
            setFileName(parts[parts.length - 1] || '');
        } else {
            setFileUrl(null);
            setFileName('');
        }
    }, [value]);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.currentTarget.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // 1️⃣ Get presigned URL from backend
            const presignRes = await fetch('/api/s3/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    folder: "documents"
                }),
            });

            if (!presignRes.ok) throw new Error('Failed to get presigned URL');

            const { uploadUrl, publicUrl } = await presignRes.json();

            // 2️⃣ Upload file to S3
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });

            if (!uploadRes.ok) throw new Error('S3 upload failed');

            // 3️⃣ Update Formik value + preview
            setFieldValue(fieldName, multiple ? [publicUrl] : publicUrl);
            setFileUrl(publicUrl);
            setFileName(file.name);

            toast.success('File uploaded successfully');

        } catch (error) {
            console.error(error);
            toast.error('File upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFieldValue(fieldName, multiple ? [] : '');
        setFileUrl(null);
        setFileName('');
    };

    const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(url);
    const isPdf = (url: string) => /\.pdf$/i.test(url);

    return (
        <div className={styleClasses?.parentDiv}>
            <Label htmlFor={id} className={styleClasses?.labelClassName || ''}>
                {placeholder}
            </Label>

            <div className={styleClasses?.inputClassName}>
                {/* File input */}
                <Input
                    id={id}
                    name={fieldName}
                    type="file"
                    multiple={multiple}
                    accept={allow}
                    disabled={disabled || isUploading}
                    onChange={handleFileChange}
                />

                {/* Uploading / Filename */}
                {fileName && (
                    <p className="text-sm text-gray-600 mt-1">
                        {isUploading ? 'Uploading…' : fileName}
                    </p>
                )}

                {/* Preview */}
                {fileUrl && (
                    <div className="mt-2 flex items-center gap-2">
                        {isImage(fileUrl) ? (
                            <img
                                src={fileUrl}
                                alt={fileName}
                                className="w-20 h-20 object-cover border rounded"
                            />
                        ) : isPdf(fileUrl) ? (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 underline"
                            >
                                <span>📄</span> {fileName}
                            </a>
                        ) : (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-700 underline"
                            >
                                {fileName}
                            </a>
                        )}

                        <button
                            type="button"
                            className="text-red-500 ml-2"
                            onClick={clearFile}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <ErrorMessage
                    name={fieldName}
                    component="div"
                    className="text-red-500 text-sm mt-1"
                />
            </div>
        </div>
    );
};

export default FileUpload;
