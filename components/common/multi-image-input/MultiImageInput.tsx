'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineClose } from 'react-icons/md';
import { Plus, Minus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from 'formik';
import styles from './imageinput.module.css';

interface MultiImageInputProps {
  id: string;
  urls?: string[] | string | null;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  setFieldValue: (field: string, value: any) => void;
  fieldName: string;
  styleClasses?: {
    parentDiv?: string;
    labelClassName?: string;
    inputClassName?: string;
  };
  error?: string | string[];
  touched?: boolean;
}

const MultiImageInput: React.FC<MultiImageInputProps> = ({
  id,
  urls,
  placeholder,
  disabled = false,
  required = false,
  setFieldValue,
  fieldName,
  styleClasses,
  error,
  touched,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewList, setPreviewList] = useState<string[]>([]);

  const validTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/avif',
  ];

  const hasError = Boolean(error && touched);

  // ✅ Normalize urls whenever prop changes
  useEffect(() => {
    if (Array.isArray(urls)) {
      setPreviewList(urls.filter(Boolean));
    } else if (typeof urls === 'string') {
      setPreviewList(urls ? [urls] : []);
    } else {
      setPreviewList([]);
    }
  }, [urls]);

  // ========== handle image upload ==========
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newFiles = Array.from(files);
      const uploadedUrls: string[] = [];

      for (const file of newFiles) {
        if (!validTypes.includes(file.type)) {
          toast.error(`${file.name} is not a valid image type`);
          continue;
        }

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

        uploadedUrls.push(publicUrl);
      }

      const updatedList = [...previewList, ...uploadedUrls];
      setPreviewList(updatedList);
      setFieldValue(fieldName, updatedList);
      toast.success('Images uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error uploading images');
    } finally {
      setIsUploading(false);
      event.target.value = ''; // reset file input
    }
  };

  // ========== remove one image ==========
  const handleRemove = (url: string) => {
    const updatedList = previewList.filter((img) => img !== url);
    setPreviewList(updatedList);
    setFieldValue(fieldName, updatedList);
  };

  // ========== remove all images ==========
  const handleRemoveAll = () => {
    setPreviewList([]);
    setFieldValue(fieldName, []);
  };

  // ✅ Always use safe list for rendering
  const safePreviewList = Array.isArray(previewList)
    ? previewList.filter(Boolean)
    : [];

  return (
    <div className={styleClasses?.parentDiv}>
      <Label htmlFor={id} className={styleClasses?.labelClassName || ''}>
        {placeholder}
        {required && <span className="text-red-600"> *</span>}
      </Label>

      <div className={`${styleClasses?.inputClassName || ''} w-full`}>
        {/* ===== Upload Bar ===== */}
        <div
          className={[
            styles.customInput,
            hasError ? 'border-red-600 ring-1 ring-red-600' : 'border-gray-300',
            disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
            'flex items-center justify-between p-2 rounded-md border transition-all',
          ].join(' ')}
        >
          {isUploading ? (
            <div className="flex items-center gap-4">
              <div className={styles.spinnerLoging} aria-label="Uploading" />
              <span className={styles.fileNameLoading}>Uploading...</span>
            </div>
          ) : (
            <>
              <span className={styles.placeholder}>Images</span>
              <span className={styles.fileName}>
                {safePreviewList.length > 0
                  ? `${safePreviewList.length} image(s)`
                  : 'No files chosen'}
              </span>

              <div className="flex gap-2 items-center">
                {/* + Add */}
                <label
                  htmlFor={fieldName}
                  className="cursor-pointer flex items-center p-1 rounded hover:bg-black/5 transition-colors"
                >
                  <Plus size={20} strokeWidth={2} />
                </label>

                {/* - Remove All */}
                {safePreviewList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRemoveAll}
                    className="flex items-center p-1 rounded hover:bg-black/5 transition-colors"
                    disabled={isUploading}
                    aria-label="Remove all images"
                  >
                    <Minus size={20} strokeWidth={2} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Hidden input */}
        <input
          type="file"
          id={fieldName}
          name={fieldName}
          multiple
          style={{ display: 'none' }}
          className={`${styles.imageElement} ${styles.defaultImgElement}`}
          onChange={handleImageChange}
          disabled={disabled || isUploading}
          accept={validTypes.join(',')}
        />

        {/* ===== Preview Grid ===== */}
        {safePreviewList.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
            {safePreviewList.map((imgUrl, index) => (
              <div
                key={index}
                className={`${styles.imgPreview} relative border rounded-lg overflow-hidden shadow-sm`}
              >
                <div
                  className="bg-cover bg-center w-full h-[90px]"
                  style={{ backgroundImage: `url("${imgUrl}")` }}
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white/70 hover:bg-white text-red-600 rounded-full p-1"
                  onClick={() => handleRemove(imgUrl)}
                  aria-label="Remove image"
                  disabled={isUploading}
                >
                  <MdOutlineClose size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ===== Error Message ===== */}
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

export default MultiImageInput;
