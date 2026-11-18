
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSlider />

      {/* Featured Services Section will be added here */}
      <FeaturedServices />

      {/* How FixMate Works Section will be added here */}
      <HowItWorks />

      {/* Popular Categories Section will be added here */}
      <PopularCategories />
    </main>
  );
}
