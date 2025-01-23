'use client';

import HeroSection from '@/components/HeroSection';
import { PlansSection } from '@/components/PlansSection';
import { FAQSection } from '@/components/FAQSection';
import { HowItWorks } from '@/components/HowItWorks';
import { SpecialFeatures } from '@/components/SpecialFeatures';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 pb-0 pt-8 px-8">
      <HeroSection />
      <HowItWorks />
      <SpecialFeatures />
      <PlansSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
