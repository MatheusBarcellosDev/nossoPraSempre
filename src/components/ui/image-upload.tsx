'use client';

import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveImage = (urlToRemove: string) => {
    onUpload(value.filter((url) => url !== urlToRemove));
  };

  const processImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Redimensionar para um tamanho máximo razoável para mobile
        const MAX_SIZE = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height = (height * MAX_SIZE) / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = (width * MAX_SIZE) / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para JPEG com qualidade reduzida
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao processar imagem'));
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          },
          'image/jpeg',
          0.8 // Qualidade reduzida para arquivos menores
        );
      };

      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsProcessing(true);
    const remainingSlots = maxFiles - value.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    // Validar tamanho dos arquivos
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = filesToProcess.filter(
      (file) => file.size > MAX_FILE_SIZE
    );
    if (oversizedFiles.length > 0) {
      toast.error(
        'Algumas imagens são muito grandes. O tamanho máximo é 10MB por imagem.'
      );
      setIsProcessing(false);
      return;
    }

    try {
      const processedImages: string[] = [];

      // Processar imagens uma por uma
      for (const file of filesToProcess) {
        try {
          const processedImage = await processImage(file);
          processedImages.push(processedImage);
          // Atualizar o estado parcialmente para feedback visual
          onUpload([...value, ...processedImages]);
        } catch (error) {
          console.error('Erro ao processar imagem:', error);
          toast.error(
            `Erro ao processar uma das imagens. Tentando continuar...`
          );
        }
      }
    } catch (error) {
      console.error('Erro ao processar imagens:', error);
      toast.error('Erro ao processar algumas imagens. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
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
          <label
            className={cn(
              'relative aspect-square rounded-lg border-2 border-dashed border-romantic-200 hover:border-romantic-300 transition-colors flex flex-col items-center justify-center gap-2 bg-romantic-50/50 hover:bg-romantic-50 text-romantic-600 hover:text-romantic-700',
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isProcessing}
              onClick={(e) => {
                (e.target as HTMLInputElement).value = '';
              }}
            />
            {isProcessing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-romantic-500 border-t-transparent" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
            <div className="text-sm text-center">
              <p className="font-medium">
                {isProcessing ? 'Processando...' : 'Carregar foto'}
              </p>
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
