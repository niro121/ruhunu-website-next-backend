'use client';

import React, { useEffect, useState } from 'react';
import styles from './videoinput.module.css';
import { MdOutlineClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import { Label } from "@/components/ui/label";
import { ErrorMessage, FormikErrors, FormikTouched } from "formik";

interface VideoInputProps {
    id: string;
    url: string;
    placeholder: string; // e.g., "Trailer Video"
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
}

// Reuse your helpers
const toErrorString = (e: VideoInputProps['error']): string | undefined => {
    if (!e) return undefined;
    if (typeof e === 'string') return e;
    if (Array.isArray(e)) {
        const flat = e.map(x => (typeof x === 'string' ? x : '')).filter(Boolean).join(', ');
        return flat || undefined;
    }
    return undefined;
};

const toTouchedBool = (t: VideoInputProps['touched']): boolean => {
    if (!t) return false;
    if (typeof t === 'boolean') return t;
    if (Array.isArray(t)) return t.some(Boolean);
    if (typeof t === 'object') return Object.values(t as Record<string, any>).some(Boolean);
    return false;
};

const VideoInput: React.FC<VideoInputProps> = ({
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
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(url ? url : null);
    const [fileName, setFileName] = useState(url ? url : '');

    useEffect(() => {
        if (typeof url === 'string' && url) {
            setFileName(url.split('/').pop() || '');
            setVideoUrl(url);
        } else {
            setFileName('');
            setVideoUrl(null);
        }
    }, [url]);

    const normalizedError = toErrorString(error);
    const normalizedTouched = toTouchedBool(touched);
    const hasError = Boolean(normalizedError && normalizedTouched);

    // VIDEO-ONLY types
    const validTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime',    // .mov
        'video/x-matroska',   // .mkv
        'video/x-msvideo',    // .avi
        'video/x-ms-wmv',     // .wmv
        'application/octet-stream', // some browsers report odd types on certain containers
    ];

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (!file) return;

        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Only video files are allowed.');
            return;
        }

        setIsUploading(true);

        try {
            const presignRes = await fetch('/api/s3/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, contentType: file.type }),
            });
            if (!presignRes.ok) throw new Error('Failed to get presigned URL');

            const { uploadUrl, publicUrl } = await presignRes.json();

            const putRes = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            if (!putRes.ok) throw new Error('S3 upload failed');

            setVideoUrl(publicUrl);
            setFileName(file.name);
            setFieldValue(fieldName, publicUrl);

            toast.success('Video uploaded');
        } catch (err) {
            console.error(err);
            toast.error('Error uploading video');
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = (e: React.MouseEvent) => {
        e.preventDefault();
        setVideoUrl(null);
        setFileName('');
        setFieldValue(fieldName, '');

        const fileInput = document.getElementById(fieldName) as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className={styleClasses?.parentDiv}>
            <Label htmlFor={id} className={styleClasses?.labelClassName || ""}>
                {placeholder}
                {required && <span className="text-red-600"> *</span>}
            </Label>

            <div className={`${styleClasses?.inputClassName} w-99`}>
                {/* Upload button */}
                {(!videoUrl || videoUrl === 'null') && (
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
                            <div className="flex items-center gap-6">
                                <div className={styles.spinnerLoging} aria-label="Uploading" />
                                <span className={styles.fileNameLoading}>Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <span className={styles.placeholder}>Video</span>
                                <span className={styles.fileName}>
                                    {fileName !== '' && videoUrl !== 'null' ? fileName : 'No file chosen'}
                                </span>
                                <span className={styles.placeholderBrowse}>Browse</span>
                            </>
                        )}
                    </label>
                )}

                {/* Hidden file input */}
                <input
                    type="file"
                    id={fieldName}
                    name={fieldName}
                    style={{ display: 'none' }}
                    className={`${styles.imageElement} ${styles.defaultImgElement} form-control-file`}
                    placeholder="Choose File"
                    onChange={handleFileChange}
                    disabled={disabled || isUploading}
                    accept={validTypes.join(',')}
                />

                {/* Video preview */}
                {videoUrl && videoUrl !== 'null' && (
                    <div
                        className={[styles.imgPreview, 'rounded', hasError ? 'ring-1 ring-red-600' : ''].join(' ')}
                        aria-invalid={hasError ? 'true' : 'false'}
                        aria-describedby={hasError ? `${fieldName}-error` : undefined}
                    >
                        {/* responsive frame */}
                        <div className={styles.videoPreview}>
                            <div className={styles.videoFrame}>
                                {isUploading && (
                                    <div className={styles.spinnerOverlay}>
                                        <div className={styles.spinner} aria-label="Uploading" />
                                    </div>
                                )}

                                <video
                                    src={videoUrl}
                                    controls
                                    preload="metadata"
                                    className={styles.videoElement}
                                />

                                <button
                                    type="button"
                                    className={styles.previewInnerCloseBtn}
                                    onClick={clearFile}
                                    aria-label="Remove video"
                                    disabled={isUploading}
                                >
                                    <MdOutlineClose />
                                </button>
                            </div>
                        </div>

                        <p className={styles.imageName}>{fileName}</p>
                    </div>
                )}

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

export default VideoInput;