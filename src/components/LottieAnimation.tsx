'use client';

import dynamic from 'next/dynamic';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
}

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  className,
}) => {
  return (
    <Lottie animationData={animationData} loop autoplay className={className} />
  );
};

export default LottieAnimation;
