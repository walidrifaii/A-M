"use client";

import Navbar from "../ui/NavBar";
import Footer from "../ui/Footer";
import MobileBubbleNav from "../components/MobileBubbleNav";
import { Mail, MapPin, Send, Instagram, Twitter, Facebook } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");

        const subject = encodeURIComponent(`New Message from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

        window.location.href = `mailto:m.aperfume7@gmail.com?subject=${subject}&body=${body}`;

        toast.success("Opening your email client...");
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
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6 text-[#445f21]">
                                Get in Touch
                            </h1>
                            <p className="text-lg opacity-80 leading-relaxed">
                                Have a question about our scents or an existing order? Our team is here to help you find your perfect fragrance.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <a
                                href="mailto:m.aperfume7@gmail.com"
                                className="flex items-center gap-6 p-6 rounded-2xl border border-neutral-300/40 hover:border-[#445f21]/50 transition-colors group"
                            >
                                <div className="h-12 w-12 rounded-xl bg-[#445f21]/10 flex items-center justify-center text-[#445f21] group-hover:bg-[#445f21] group-hover:text-white transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Email Us</p>
                                    <p className="font-semibold">m.aperfume7@gmail.com</p>
                                </div>
                            </a>

                            {/* <a
                                href="tel:+96170000000"
                                className="flex items-center gap-6 p-6 rounded-2xl border border-neutral-300/40 hover:border-[#445f21]/50 transition-colors group"
                            >
                                <div className="h-12 w-12 rounded-xl bg-[#445f21]/10 flex items-center justify-center text-[#445f21] group-hover:bg-[#445f21] group-hover:text-white transition-all">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Call Us</p>
                                    <p className="font-semibold">+961 70 000 000</p>
                                </div>
                            </a> */}

                            <div className="flex items-center gap-6 p-6 rounded-2xl border border-neutral-300/40 hover:border-[#445f21]/50 transition-colors">
                                <div className="h-12 w-12 rounded-xl bg-[#445f21]/10 flex items-center justify-center text-[#445f21]">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-60 font-bold mb-1">Visit Us</p>
                                    <p className="font-semibold">Minieh, Lebanon</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                                <button key={idx} className="h-12 w-12 rounded-xl border border-neutral-300/40 flex items-center justify-center hover:bg-[#445f21] hover:text-white transition-all transform hover:-translate-y-1">
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
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full p-4 rounded-xl border border-neutral-300/50 bg-transparent focus:ring-2 focus:ring-[#445f21]/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80 pl-1">Email</label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full p-4 rounded-xl border border-neutral-300/50 bg-transparent focus:ring-2 focus:ring-[#445f21]/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold opacity-80 pl-1">Message</label>
                                <textarea
                                    required
                                    name="message"
                                    rows={6}
                                    placeholder="How can we help?"
                                    className="w-full p-4 rounded-xl border border-neutral-300/50 bg-transparent focus:ring-2 focus:ring-[#445f21]/50 outline-none transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-[#445f21] text-white font-bold text-lg shadow-xl shadow-[#445f21]/20 hover:bg-[#385119] transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
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
