'use client';

import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
}

export function LottieAnimation({
  animationData,
  className,
}: LottieAnimationProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      className={className}
    />
  );
}
