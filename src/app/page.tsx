import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSlider />

      {/* Featured Services Section will be added here */}

      <Suspense
        fallback={
          <section className="bg-zinc-50 px-6 py-20 text-center dark:bg-black">
            <p className="text-zinc-600 dark:text-zinc-400">
              Loading Featured Services...
            </p>
          </section>
        }
      >
        <FeaturedServices />
      </Suspense>
      {/* How FixMate Works Section will be added here */}
      <HowItWorks />

      {/* Popular Categories Section will be added here */}
      <PopularCategories />
      <WhyChooseUs />
    </main>
  );
}
