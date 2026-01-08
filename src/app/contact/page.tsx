"use client";

import Navbar from "../ui/NavBar";
import Footer from "../ui/Footer";
import MobileBubbleNav from "../components/MobileBubbleNav";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you soon.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <main className="min-h-screen transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
            <MobileBubbleNav />
            <Navbar />

            <div className="mx-auto px-4 sm:px-6 lg:px-32 py-12 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                                Get in Touch
                            </h1>
                            <p className="text-lg opacity-80 leading-relaxed">
                                Have a question about our scents or an existing order? Our team is here to help you find your perfect fragrance.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 rounded-2xl border border-neutral-300/40 hover:border-yellow-500/50 transition-colors">
                                <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Email Us</p>
                                    <p className="font-semibold">support@maperfume.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 rounded-2xl border border-neutral-300/40 hover:border-yellow-500/50 transition-colors">
                                <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Call Us</p>
                                    <p className="font-semibold">+961 70 000 000</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 rounded-2xl border border-neutral-300/40 hover:border-yellow-500/50 transition-colors">
                                <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Visit Us</p>
                                    <p className="font-semibold">Beirut, Lebanon</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                                <button key={idx} className="h-12 w-12 rounded-xl border border-neutral-300/40 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all transform hover:-translate-y-1">
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className=" p-8 rounded-[2.5rem] border border-neutral-300/40 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80 pl-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full p-4 rounded-xl border border-neutral-300/50 bg-transparent focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80 pl-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full p-4 rounded-xl border border-neutral-300/50 bg-transparent focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80 pl-1">Message</label>
                                <textarea
                                    required
                                    rows={6}
                                    placeholder="How can we help?"
                                    className="w-full p-4 rounded-xl border border-neutral-300/50 bg-transparent focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-yellow-500 text-white font-bold text-lg shadow-xl shadow-yellow-500/20 hover:bg-yellow-600 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                Send Message <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
