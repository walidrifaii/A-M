'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, LogOut } from 'lucide-react'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen}: SidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()

  //  Prevent body scroll when sidebar open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const handleLogout = () => {
    // Remove access token from cookies
    Cookies.remove('access_token')
    toast.success('Logged out successfully')
    // Close sidebar on mobile
    setIsOpen(false)
    // Redirect to login page
    router.push('/auth/login')
  }

  // Check if pathname matches or starts with the href (for nested routes)
  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const menuItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
  
  ]

  return (
    <>
      <Toaster position="top-right" />
      
      {/* ====== Overlay for mobile ====== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ====== Sidebar ====== */}
      <aside
        className={`
           fixed top-0 left-0 lg:top-28 lg:left-16
          bg-[var(--background)]  lg:bg-transparent
           shadow-xl lg:shadow-none
           z-50 lg:z-auto
           flex flex-col
           h-screen lg:h-[calc(100vh-7rem)]
           w-72 lg:w-56
           px-4 sm:px-6 lg:px-0
           transition-transform duration-300 ease-in-out
           ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
           overflow-hidden
           pt-20 lg:pt-6
         `}
      >
        {/* Header Section */}
        <div className="flex-shrink-0 lg:pt-6">
          <h1 className="hidden lg:block text-2xl lg:text-3xl text-gray-500 mb-8 font-semibold">
            Manage
          </h1>
          <Link 
            href="/" 
            className="flex items-center gap-2 lg:hidden mb-6 px-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-300 text-white shadow-lg">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6">
                <path fill="currentColor" d="M12 3l9 7-3 11H6L3 10l9-7z" />
              </svg>
            </span>
            <span className="text-lg sm:text-xl font-semibold tracking-tight ">M&A</span>
          </Link>
        </div>

        {/* ====== Navigation ====== */}
        <nav className="flex-1 space-y-3 pb-4 overflow-y-auto min-h-0">
          {menuItems.map((item) => {
            const isActive = isActiveRoute(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)} // auto close sidebar on mobile
                className={`
                  flex items-center gap-3 px-4  py-3 lg:py-4  w-full  rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-[#fcebc0] text-amber-600 font-semibold'
                    : ' hover:bg-gray-100'
                  }
                  active:scale-95 lg:active:scale-100
                `}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-amber-600' : ''}`}>
                  <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <span className={`text-sm lg:text-base ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* ====== Logout Button ====== */}
        <div className="flex-shrink-0 pt-4 pb-6 lg:pb-6 border-t border-gray-200 lg:border-t-0 mt-auto">
          <button
            onClick={handleLogout}
            className="group w-full lg:w-fit border border-red-400 flex items-center gap-3 px-10 py-3 lg:py-4 
            rounded-lg   transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-600 active:scale-95 lg:active:scale-100"
          >
            <div className="  text-red-600 transition-colors">
              <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
            </div>
            <span className="text-sm lg:text-base text-red-600  font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
