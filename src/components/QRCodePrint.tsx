'use client';

import { useEffect } from 'react';

interface QRCodePrintProps {
  url: string;
  title?: string;
  onLoad?: () => void;
}

export function QRCodePrint({
  url,
  title = 'O Nosso Pra Sempre',
  onLoad,
}: QRCodePrintProps) {
  useEffect(() => {
    // Carrega o script do QRCode
    const script = document.createElement('script');
    script.src =
      'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js';
    script.async = true;

    script.onload = () => {
      // Cria o QR Code
      new (window as any).QRCode(document.getElementById('qr'), {
        text: url,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: (window as any).QRCode.CorrectLevel.H,
      });

      // Chama o callback de onLoad se existir
      if (onLoad) {
        onLoad();
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, onLoad]);

  return (
    <div className="container">
      <style jsx>{`
        .container {
          text-align: center;
          padding: 2rem;
        }
        h1 {
          color: #666;
          font-weight: 300;
          margin-bottom: 2rem;
        }
        .qr-code {
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          display: inline-block;
        }
        p {
          color: #666;
          margin-top: 1rem;
        }
      `}</style>

      <h1>{title}</h1>
      <div className="qr-code">
        <div id="qr"></div>
      </div>
      <p>Escaneie para acessar a página</p>
    </div>
  );
}
