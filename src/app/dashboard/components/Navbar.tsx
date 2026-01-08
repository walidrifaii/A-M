import { Moon, Sun, LogOut } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdShoppingCart } from 'react-icons/md'
import { RiMenuLine } from 'react-icons/ri'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

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
        if (mode === "dark") root.classList.add("dark");
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

    const handleLogout = () => {
        Cookies.remove('access_token');
        router.push('/');
    };

    return (
        <div className='bg-[var(--background)]  flex items-center justify-between mx-auto 
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 w-full 
                       h-[80px] sm:h-[90px] lg:h-[100px] fixed z-10 transition-colors duration-300'>
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
                        <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">M&A</span>
                    </Link>
                </div>

                <div className='hidden lg:flex items-center gap-4'>
                    {/* <div className='bg-[var(--background)] border border-neutral-200 dark:border-neutral-700
                     rounded-full p-3  transition-colors'>
                        <MdShoppingCart className='text-2xl text-[var(--foreground)]' />
                    </div> */}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 
                         hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer
                         transition-colors border border-red-500"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                    </button>

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDark((v) => !v)}
                        className="rounded-xl p-2 text-[var(--foreground)] hover:bg-yellow-400/20
                         dark:hover:bg-yellow-400/10 focus:outline-none ring-2
                          ring-yellow-400/60 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                </div>
                <div className='lg:hidden flex items-center gap-4'>
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={() => setIsDark((v) => !v)}
                        className="p-2 rounded-lg text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-[var(--background)] border border-neutral-200 dark:border-neutral-700 
                        rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[var(--foreground)] transition-colors"
                    >
                        <RiMenuLine size={24} />
                    </button>
                </div>
            </section>
        </div>
    )
}

export default NavbarDashboard