'use client';

import dynamic from 'next/dynamic';
import { useLottie, LottieOptions } from 'lottie-react';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
}

function LottieAnimationInner({
  animationData,
  className,
}: LottieAnimationProps) {
  const options: LottieOptions = {
    animationData: animationData,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return <div className={className}>{View}</div>;
}

export const LottieAnimation = dynamic(
  () => Promise.resolve(LottieAnimationInner),
  {
    ssr: false,
  }
);
