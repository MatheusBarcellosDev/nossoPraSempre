'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export function ImageUpload({
  onUpload,
  maxFiles = 6,
  disabled,
}: ImageUploadProps) {
  return (
    <div>
      <CldUploadWidget
        uploadPreset="casal-web"
        options={{
          maxFiles,
          sources: ['local'],
          multiple: true,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
          maxFileSize: 10000000, // 10MB
        }}
        onSuccess={(result: any) => {
          if (result.info) {
            const urls = Array.isArray(result.info)
              ? result.info.map((info: any) => info.secure_url)
              : [result.info.secure_url];
            onUpload(urls);
          }
        }}
      >
        {({ open }) => (
          <div
            onClick={() => !disabled && open?.()}
            className={`
              relative w-full border-2 border-dashed rounded-lg p-20
              hover:bg-gray-50 transition cursor-pointer
              flex flex-col items-center justify-center gap-4
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Upload className="h-10 w-10 text-gray-500" />
            <div className="text-gray-500 text-center">
              <p className="font-semibold">Clique para fazer upload</p>
              <p className="text-xs">
                {disabled
                  ? 'Limite de fotos atingido'
                  : 'Adicione até ' + maxFiles + ' fotos'}
              </p>
            </div>
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}
