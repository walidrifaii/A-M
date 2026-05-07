import { Moon, Sun, LogOut } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { RiMenuLine } from 'react-icons/ri'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import logo2 from "../../../assets/logo2.png";

interface NavbarProps {
    isSidebarOpen: boolean
    setIsSidebarOpen: (open: boolean) => void
}

const NavbarDashboard = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const router = useRouter();

    function applyThemeClass(mode: "dark" | "light") {
        const root = document.documentElement;
        root.classList.remove("theme-dark", "theme-light", "dark", "light");
        root.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
        root.classList.add(mode === "dark" ? "dark" : "light");
    }

    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const dark = saved ? saved === "dark" : prefersDark;
            setIsDark(dark);
            applyThemeClass(dark ? "dark" : "light");
        } catch { }
    }, []);

    useEffect(() => {
        if (!mounted) return;
        applyThemeClass(isDark ? "dark" : "light");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark, mounted]);

    const handleLogout = () => {
        Cookies.remove('access_token');
        router.push('/');
    };

    return (
        <div className='bg-[#485e38] flex items-center justify-between mx-auto 
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full shadow-lg
        h-[70px] sm:h-[80px] lg:h-[90px] fixed z-[100] transition-all duration-300'>
            {/* Logo Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                    <RiMenuLine size={24} />
                </button>
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo2} alt="Logo" width={180} height={180} className="brightness-0 invert object-contain" />
                </Link>
            </div>

            {/* Desktop Actions */}
            <div className='hidden lg:flex items-center gap-6'>
                {/* Theme Toggle */}
                <button
                    onClick={() => setIsDark((v) => !v)}
                    className="rounded-xl p-2.5 text-white hover:bg-white/10 transition-all duration-300 border border-white/20"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <div className="h-8 w-px bg-white/20"></div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold
                     hover:bg-red-500 transition-all duration-300 border-2 border-white/30"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                </button>
            </div>

            {/* Mobile Menu Icon */}
            <div className='lg:hidden flex items-center gap-4'>
                <button
                    onClick={() => setIsDark((v) => !v)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
            </div>
        </div>
    )
}

export default NavbarDashboard
