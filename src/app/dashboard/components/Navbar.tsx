import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdShoppingCart } from 'react-icons/md'
import { RiMenuLine } from 'react-icons/ri'

interface NavbarProps {
    isSidebarOpen: boolean
    setIsSidebarOpen: (open: boolean) => void
}




const NavbarDashboard = ({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) => {

    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    function applyThemeClass(mode: "dark" | "light") {
        const root = document.documentElement;
        root.classList.remove("theme-dark", "theme-light");
        root.classList.add(mode === "dark" ? "theme-dark" : "theme-light");
    }

    // Load theme
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

    // Persist theme
    useEffect(() => {
        if (!mounted) return;
        applyThemeClass(isDark ? "dark" : "light");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark, mounted]);

    return (

        <div className='bg-transparent flex items-center justify-between mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-32 w-full 
                       h-[80px] sm:h-[90px] lg:h-[100px]  fixed z-10  '>
            {/* Logo */}
            <section className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-4'>


                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-300 text-white shadow">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                <path fill="currentColor" d="M12 3l9 7-3 11H6L3 10l9-7z" />
                            </svg>
                        </span>
                        <span className="text-lg font-semibold tracking-tight">M&A</span>
                    </Link>
                </div>

                <div className='hidden lg:flex items-center gap-2'>
                    <div className='bg-secondary-foreground rounded-full p-3'>
                        <MdShoppingCart className='text-2xl ' />
                    </div>
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDark((v) => !v)}
                        className="ml-2 rounded-xl p-2 hover:bg-yellow-400/20 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                </div>
                <div className='lg:hidden'>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className=" p-2 bg-secondary-foreground rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <RiMenuLine size={24} />
                    </button>
                </div>
            </section>

        </div>
    )
}

export default NavbarDashboard