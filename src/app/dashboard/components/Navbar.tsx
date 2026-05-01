import { Moon, Sun, LogOut } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdShoppingCart } from 'react-icons/md'
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
                <Link href="/" className="flex items-center gap-2">
              <Image src={logo2} alt="Logo" width={250} height={250} />
            </Link>

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
                        className="rounded-xl p-2 text-[var(--foreground)] hover:bg-brand-400/20
                         dark:hover:bg-brand-400/10 focus:outline-none ring-2
                          ring-brand-400/60 transition-colors"
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
