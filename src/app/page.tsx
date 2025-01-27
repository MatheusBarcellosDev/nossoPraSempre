import { FAQSection } from '@/components/FAQSection';
import { HowItWorks } from '@/components/HowItWorks';
import { SpecialFeatures } from '@/components/SpecialFeatures';
import { Footer } from '@/components/Footer';
import { PlansSection } from '@/components/PlansSection';
import { HomeShowcase } from '@/components/HomeShowcase';
import { HeroSection } from '@/components/HeroSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 pb-0">
      <div className="px-4 sm:px-8">
        <HeroSection />
        <HowItWorks />
        <HomeShowcase />
        <SpecialFeatures />
        <PlansSection />
        <FAQSection />
      </div>
      <Footer />
    </main>
  );
}
