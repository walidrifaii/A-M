"use client";

import Navbar from "../ui/NavBar";
import Footer from "../ui/Footer";
import MobileBubbleNav from "../components/MobileBubbleNav";
import Image from "next/image";
import { Star, Shield, Zap, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
            <MobileBubbleNav />
            <Navbar />

            <div className="mx-auto px-4 sm:px-6 lg:px-32 py-12 lg:py-24">
                {/* Hero Section */}
                <section className="mb-20 text-center">
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6  text-[#445f21]">
                        Crafting Elegance
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg opacity-80 leading-relaxed">
                       We have been dedicated to recreating the most iconic fragrances in the world,
                        bringing luxury and sophistication to your doorstep at an accessible price point.
                    </p>
                </section>

                {/* Story Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000"
                            alt="Perfume Crafting"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">Our Philosophy</h2>
                        <p className="opacity-80 leading-relaxed">
                            We believe that scent is a language—a silent dialogue that speaks of personality, memory, and emotion.
                            Our mission is to democratize high-end perfumery by focusing on the quality of ingredients rather than
                            expensive marketing and packaging.
                        </p>
                        <p className="opacity-80 leading-relaxed">
                            Every bottle we produce is a testament to our commitment to excellence. We source only the finest essential oils
                            from Grasse, France—the perfume capital of the world—to ensure our recreations are indistinguishable from the originals.
                        </p>
                    </div>
                </div>

                {/* Values section */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-y border-neutral-300/40">
                    {[
                        { icon: <Star className="h-6 w-6 text-brand-500" />, title: "Premium Quality", desc: "Finest ingredients sourced globally." },
                        { icon: <Shield className="h-6 w-6 text-brand-500" />, title: "Longevity", desc: "Formulated for lasting intensity." },
                        { icon: <Zap className="h-6 w-6 text-brand-500" />, title: "Precision", desc: "Scientific approach to scent matching." },
                        { icon: <Heart className="h-6 w-6 text-brand-500" />, title: "Ethical", desc: "Vegan-friendly and cruelty-free." }
                    ].map((val, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6">
                            <div className="mb-4">{val.icon}</div>
                            <h3 className="font-bold mb-2">{val.title}</h3>
                            <p className="text-sm opacity-70">{val.desc}</p>
                        </div>
                    ))}
                </section>
            </div>

            <Footer />
        </main>
    );
}
