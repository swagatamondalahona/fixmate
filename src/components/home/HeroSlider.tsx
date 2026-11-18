
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";


const slides = [
    {
        image: "/smartphone-repair.jpg",
        title: "Broken Phone?",
        highlight: "We've Got You Covered.",
        description:
            "Get expert smartphone repair services from trusted technicians.",
        button: "Explore Services",
    },
    {
        image: "/laptop-repair.jpg",
        title: "Laptop Problems?",
        highlight: "We Can Fix Them.",
        description:
            "Reliable laptop and computer repair services at your convenience.",
        button: "Explore Services",
    },
    {
        image: "/home-appliance-repair.jpg",
        title: "Appliance Not Working?",
        highlight: "We've Got the Solution.",
        description:
            "Get professional repair services for your home appliances.",
        button: "Explore Services",
    },
];


export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide(
            (prev) => (prev - 1 + slides.length) % slides.length
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const slide = slides[currentSlide];

    return (
        <section className="relative w-full overflow-hidden bg-black">
            <div className="relative min-h-[520px] md:min-h-[600px]">
                {/* Background Image */}
                <Image
                    key={slide.image}
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover transition-opacity duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-orange-950/70" />
                {/* Content */}
                <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-20 md:min-h-[600px]">
                    <div className="max-w-2xl text-white">
                        <span className="mb-5 inline-block rounded-full border border-orange-500/50 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">
                            Trusted Repair Service Platform
                        </span>

                        <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
                            {slide.title}
                            <span className="block text-orange-500">
                                {slide.highlight}
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 md:text-lg">
                            {slide.description}
                        </p>

                        <Link
                            href="/services"
                            className="mt-8 inline-block rounded-lg bg-orange-500 px-7 py-3.5 font-bold text-white transition hover:bg-orange-600"
                        >
                            {slide.button} →
                        </Link>
                    </div>
                </div>

                {/* Previous Button */}
                <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-2xl text-white transition hover:bg-orange-500"
                >
                    ‹
                </button>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-2xl text-white transition hover:bg-orange-500"
                >
                    ›
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                    {slides.map((item, index) => (
                        <button
                            key={item.image}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all ${currentSlide === index
                                ? "w-9 bg-orange-500"
                                : "w-2.5 bg-white/60 hover:bg-white"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
