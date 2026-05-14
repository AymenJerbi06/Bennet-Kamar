import HeroSection from '@/components/HeroSection';
import OrderSection from '@/components/OrderSection';
import RecipesSection from '@/components/RecipesSection';
import ShopSection from '@/components/ShopSection';
import StorySection from '@/components/StorySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import VideoSection from '@/components/VideoSection';
import WhatInsideSection from '@/components/WhatInsideSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <ShopSection />
      <RecipesSection />
      <VideoSection />
      <WhatInsideSection />
      <TestimonialsSection />
      <OrderSection />
    </main>
  );
}
