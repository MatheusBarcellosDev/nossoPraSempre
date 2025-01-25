'use client';

import { useRef } from 'react';

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

  if (!videoId) return null;

  // Configura a URL do vídeo
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&playsinline=1&controls=1&enablejsapi=1`;

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        allow="autoplay; clipboard-write; encrypted-media; accelerometer; gyroscope; microphone"
        allowFullScreen
        className="w-full h-full rounded-lg"
        {...{ disablePictureInPicture: true }}
      />
    </div>
  );
}
