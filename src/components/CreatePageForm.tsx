'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TemplateSelector from './TemplateSelector';

export default function CreatePageForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('minimalista');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement form submission
    // 1. Upload images to Cloudinary
    // 2. Create payment session with Stripe
    // 3. Save page data to database
    // 4. Redirect to payment page

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="coupleName" className="block text-sm font-medium mb-2">
          Nome do Casal
        </label>
        <input
          type="text"
          id="coupleName"
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          placeholder="Ex: João e Maria"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Mensagem Personalizada
        </label>
        <textarea
          id="message"
          required
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          placeholder="Conte sua história de amor..."
        />
      </div>

      <div>
        <label htmlFor="photos" className="block text-sm font-medium mb-2">
          Fotos
        </label>
        <input
          type="file"
          id="photos"
          multiple
          accept="image/*"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="videos" className="block text-sm font-medium mb-2">
          Vídeos
        </label>
        <input
          type="file"
          id="videos"
          multiple
          accept="video/*"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Senha de Acesso
        </label>
        <input
          type="password"
          id="password"
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          placeholder="Digite uma senha para proteger sua página"
        />
      </div>

      <TemplateSelector
        selectedTemplate={selectedTemplate}
        onSelect={setSelectedTemplate}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Processando...' : 'Criar Página'}
      </button>
    </form>
  );
}
