'use client';

import { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  url: string;
  className?: string;
}

export function YouTubePlayer({ url, className = '' }: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Extrai o ID do vídeo da URL do YouTube
  const videoId = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/
  )?.[1];

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src.replace(
          'mute=1',
          'mute=0'
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, []);

  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&playsinline=1&controls=1&enablejsapi=1&origin=${encodeURIComponent(
    window.location.origin
  )}`;

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; accelerometer; gyroscope; microphone"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
    </div>
  );
}
