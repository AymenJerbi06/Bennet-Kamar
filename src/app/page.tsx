import HeroSection from '@/components/HeroSection';
import OrderSection from '@/components/OrderSection';
import ShopSection from '@/components/ShopSection';
import StorySection from '@/components/StorySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import VideoSection from '@/components/VideoSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StorySection />
      <ShopSection />
      <VideoSection />
      <TestimonialsSection />
      <OrderSection />
    </main>
  );
}
