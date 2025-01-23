'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface PasswordCheckProps {
  onSuccess: () => void;
  correctPassword: string;
}

export function PasswordCheck({
  onSuccess,
  correctPassword,
}: PasswordCheckProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    if (password === correctPassword) {
      onSuccess();
    } else {
      setError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-romantic-50 to-romantic-100 p-4">
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-romantic-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-romantic-500" />
          </div>
          <h1 className="text-2xl font-semibold text-romantic-800 mb-2">
            Página Protegida
          </h1>
          <p className="text-romantic-600">
            Esta página é privada. Por favor, digite a senha para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">Senha incorreta</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!password || isLoading}
          >
            {isLoading ? 'Verificando...' : 'Acessar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
