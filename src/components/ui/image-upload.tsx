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
          <CldUploadWidget
            uploadPreset="casal-web"
            options={{
              maxFiles: maxFiles - value.length,
              clientAllowedFormats: ['image'],
              maxFileSize: 2000000,
              sources: ['local', 'url', 'camera'],
              styles: {
                palette: {
                  window: '#FFFFFF',
                  windowBorder: '#FDF2F8',
                  tabIcon: '#DB2777',
                  menuIcons: '#DB2777',
                  textDark: '#000000',
                  textLight: '#FFFFFF',
                  link: '#DB2777',
                  action: '#DB2777',
                  inactiveTabIcon: '#E5E7EB',
                  error: '#EF4444',
                  inProgress: '#DB2777',
                  complete: '#10B981',
                  sourceBg: '#FFFFFF',
                },
                fonts: {
                  default: null,
                  "'Inter', sans-serif": {
                    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
                    active: true,
                  },
                },
              },
              text: {
                'pt-BR': {
                  local: {
                    browse: 'Procurar',
                    dd_title_single: 'Arraste e solte sua foto aqui',
                    dd_title_multi: 'Arraste e solte suas fotos aqui',
                    drop_title_single: 'Solte sua foto aqui',
                    drop_title_multi: 'Solte suas fotos aqui',
                  },
                },
              },
              language: 'pt-BR',
            }}
            onSuccess={(result: any) => {
              if (result?.info?.secure_url) {
                onUpload([...value, result.info.secure_url]);
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="relative aspect-square rounded-lg border-2 border-dashed border-romantic-200 hover:border-romantic-300 transition-colors flex flex-col items-center justify-center gap-2 bg-romantic-50/50 hover:bg-romantic-50 text-romantic-600 hover:text-romantic-700"
              >
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
              </button>
            )}
          </CldUploadWidget>
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
