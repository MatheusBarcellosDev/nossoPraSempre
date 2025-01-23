import dynamic from 'next/dynamic';
import { FAQSection } from '@/components/FAQSection';
import { HowItWorks } from '@/components/HowItWorks';
import { SpecialFeatures } from '@/components/SpecialFeatures';
import { Footer } from '@/components/Footer';
import { PlansSection } from '@/components/PlansSection';

const HeroSection = dynamic(() => import('../components/HeroSection'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 pb-0 pt-8 px-8">
      {/* <HeroSection /> */}
      <HowItWorks />
      <SpecialFeatures />
      <PlansSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
