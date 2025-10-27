'use client';

import React, { useEffect, useState } from 'react';
import styles from './imageinput.module.css';
import { MdOutlineClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import { Label } from "@/components/ui/label";
import { ErrorMessage, FormikErrors, FormikTouched } from "formik";

interface ImageInputProps {
    id: string;
    url: string;
    placeholder: string;
    disabled?: boolean;
    required: boolean;
    setFieldValue: (field: string, value: any) => void;
    fieldName: string;
    styleClasses?: {
        parentDiv?: string;
        labelClassName?: string;
        inputClassName?: string;
    };
    error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
    touched?: boolean | FormikTouched<any> | FormikTouched<any>[];

    imgPreviewStyleClasses?: string;
    previewImgOnly?: boolean; // show only img preview no close button
    previewSize?: number;
}

// Formik error value into a plain string
const toErrorString = (e: ImageInputProps['error']): string | undefined => {
    if (!e) return undefined;
    if (typeof e === 'string') return e;
    if (Array.isArray(e)) {
        const flat = e.map(x => (typeof x === 'string' ? x : '')).filter(Boolean).join(', ');
        return flat || undefined;
    }
    return undefined; // ignore nested objects
};

// Formik touched value into a simple boolean
const toTouchedBool = (t: ImageInputProps['touched']): boolean => {
    if (!t) return false;
    if (typeof t === 'boolean') return t;
    if (Array.isArray(t)) return t.some(Boolean);
    if (typeof t === 'object') return Object.values(t as Record<string, any>).some(Boolean);
    return false;
};

const ImageInput: React.FC<ImageInputProps> = ({
    id,
    url,
    placeholder,
    disabled = false,
    required,
    setFieldValue,
    fieldName,
    styleClasses,
    error,
    touched,
    imgPreviewStyleClasses,
    previewImgOnly = false,
    previewSize = 50,
}) => {

    const [isUploading, setIsUploading] = useState(false); // are we in the middle of an upload?
    const [imagePreview, setImagePreview] = useState<string | null>(url ? url : null); // preview URL
    const [imgName, setImgName] = useState(url ? url : ''); // displayed file name

    // keep local state in sync with external Formik url
    useEffect(() => {
        if (typeof url === 'string' && url) {
            setImgName(url.split('/').pop() || '');
            setImagePreview(url);
        } else {
            setImgName('');
            setImagePreview(null);
        }
    }, [url]);

    // normalize error + touched
    const normalizedError = toErrorString(error);
    const normalizedTouched = toTouchedBool(touched);
    const hasError = Boolean(normalizedError && normalizedTouched);

    // allowed file types for upload
    const validTypes = [
        'image/jpeg', 'image/png', 'image/jpg', 'image/webp',
        'image/gif', 'image/bmp', 'image/svg+xml', 'image/avif'
    ];

    // main handler when user picks a file
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (!file) return;

        // simple MIME type validation
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Only image files are allowed.');
            return;
        }

        setIsUploading(true);

        try {
            // ask backend for presigned S3 URL
            const presignRes = await fetch('/api/s3/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, contentType: file.type }),
            });
            if (!presignRes.ok) throw new Error('Failed to get presigned URL');

            const { uploadUrl, publicUrl } = await presignRes.json();

            // put the file directly to S3
            const putRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            if (!putRes.ok) throw new Error('S3 upload failed');

            // update local + Formik state
            setImagePreview(publicUrl);
            setImgName(file.name);
            setFieldValue(fieldName, publicUrl);

            toast.success('Image uploaded');
        } catch (err) {
            console.error(err);
            toast.error('Error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    // clear image from state + Formik
    const clearImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setImagePreview(null);
        setImgName('');
        setFieldValue(fieldName, '');

        // also reset the hidden <input type="file">
        const fileInput = document.getElementById(fieldName) as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className={styleClasses?.parentDiv}>
            {/* label with required marker */}
            <Label htmlFor={id} className={styleClasses?.labelClassName || ""}>
                {placeholder}
                {required && <span className="text-red-600"> *</span>}
            </Label>

            <div className={`${styleClasses?.inputClassName} w-99`}>
                {/* upload button area */}
                {(!imagePreview || imagePreview === 'null') && (
                    <label
                        htmlFor={fieldName}
                        className={[
                            styles.customInput,
                            'p-2 rounded border transition-colors',
                            hasError ? 'border-red-600 ring-1 ring-red-600' : 'border-gray-300',
                            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
                            'relative'
                        ].join(' ')}
                        aria-invalid={hasError ? 'true' : 'false'}
                        aria-describedby={hasError ? `${fieldName}-error` : undefined}
                    >
                        {isUploading ? (
                            // spinner mode
                            <div className="flex items-center gap-6">
                                <div className={styles.spinnerLoging} aria-label="Uploading" />
                                <span className={styles.fileNameLoading}>Uploading...</span>
                            </div>
                        ) : (
                            // normal text/buttons
                            <>
                                <span className={styles.placeholder}>Image</span>
                                <span className={styles.fileName}>
                                    {imgName !== '' && imagePreview !== 'null' ? imgName : 'No file chosen'}
                                </span>
                                <span className={styles.placeholderBrowse}>Browse</span>
                            </>
                        )}
                    </label>
                )}

                {/* hidden file input triggered by clicking label above */}
                <input
                    type="file"
                    id={fieldName}
                    name={fieldName}
                    style={{ display: 'none' }}
                    className={`${styles.imageElement} ${styles.defaultImgElement} form-control-file`}
                    placeholder="Choose File"
                    onChange={handleImageChange}
                    disabled={disabled || isUploading}
                    accept={validTypes.join(',')}
                />

                {/* image preview section */}
                {imagePreview && imagePreview !== 'null' && (
                    previewImgOnly ? (
                        // --- img preview: 50x50 by default, full image (contain), no close btn, no filename ---
                        <div
                            className={[
                                // If custom classes provided, use them, else default
                                imgPreviewStyleClasses || `inline-flex items-center justify-center rounded border border-gray-300 p-1`
                            ].join(' ')}
                            aria-invalid={hasError ? 'true' : 'false'}
                            aria-describedby={hasError ? `${fieldName}-error` : undefined}
                        >
                            <img
                                src={imagePreview}
                                alt={imgName || 'preview'}
                                width={previewSize}
                                height={previewSize}
                                className="object-contain"
                                style={{ width: previewSize, height: previewSize }}
                            />
                            
                        </div>
                    ) : (
                        // --- else background & close button ---
                        <div
                            className={[
                                styles.imgPreview,
                                'rounded',
                                hasError ? 'ring-1 ring-red-600' : ''
                            ].join(' ')}
                            aria-invalid={hasError ? 'true' : 'false'}
                            aria-describedby={hasError ? `${fieldName}-error` : undefined}
                        >
                            <div
                                className={`${styles.imageViewInner} relative`}
                                style={{ backgroundImage: `url("${imagePreview}")` }}
                            >
                                {isUploading && (
                                    <div className="absolute inset-0 grid place-items-center bg-black/30">
                                        <div className={styles.spinner} aria-label="Uploading" />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className={styles.previewInnerCloseBtn}
                                    onClick={clearImage}
                                    aria-label="Remove image"
                                    disabled={isUploading}
                                >
                                    <MdOutlineClose />
                                </button>
                            </div>

                            <p className={styles.imageName}>{imgName}</p>
                            
                        </div>
                    )
                )}

                {/* error message from Formik */}
                <ErrorMessage
                    name={fieldName}
                    component="div"
                    id={`${fieldName}-error`}
                    className="invalid-feedback text-red-600 text-sm whitespace-pre-wrap pt-1 sm:pt-0 mt-2"
                />
            </div>
            
        </div>
    );
};

export default ImageInput;