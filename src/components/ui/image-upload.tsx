'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  value: string[];
  maxFiles?: number;
}

export function ImageUpload({
  onUpload,
  value = [],
  maxFiles = 6,
}: ImageUploadProps) {
  const handleRemoveImage = (urlToRemove: string) => {
    onUpload(value.filter((url) => url !== urlToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxFiles - value.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    Promise.all(
      filesToProcess.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      })
    ).then((base64urls) => {
      onUpload([...value, ...base64urls]);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative group aspect-square rounded-lg overflow-hidden"
          >
            <Image
              src={url}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <button
              onClick={() => handleRemoveImage(url)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-romantic-800 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {value.length < maxFiles && (
          <label className="relative aspect-square rounded-lg border-2 border-dashed border-romantic-200 hover:border-romantic-300 transition-colors flex flex-col items-center justify-center gap-2 bg-romantic-50/50 hover:bg-romantic-50 text-romantic-600 hover:text-romantic-700 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              onClick={(e) => {
                // Reset value to allow selecting the same file again
                (e.target as HTMLInputElement).value = '';
              }}
            />
            <Upload className="w-6 h-6" />
            <div className="text-sm text-center">
              <p className="font-medium">Carregar foto</p>
              <p className="text-xs text-romantic-500">
                {maxFiles - value.length}{' '}
                {maxFiles - value.length === 1
                  ? 'foto restante'
                  : 'fotos restantes'}
              </p>
            </div>
          </label>
        )}
      </div>
      {value.length === 0 && (
        <p className="text-sm text-romantic-500 text-center">
          Arraste e solte suas fotos aqui ou clique para fazer upload
        </p>
      )}
    </div>
  );
}
