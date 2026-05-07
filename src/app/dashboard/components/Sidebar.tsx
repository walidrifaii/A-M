'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Package } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen}: SidebarProps) => {
  const pathname = usePathname()

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



  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const menuItems = [
    {
      href: '/dashboard',
      icon: Package,
      label: 'Inventory'
    },
    {
      href: '/dashboard/orders',
      icon: ShoppingBag,
      label: 'Orders'
    },
  ]

  return (
    <>
      <Toaster position="top-right" />
      
      {/* ====== Mobile Overlay ====== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ====== Sidebar ====== */}
      <aside
        className={`
          fixed top-0 left-0 z-[70] h-screen
          bg-[#485e38] 
          border-r border-white/10
          transition-all duration-300 ease-in-out
          w-72 lg:w-64 shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="h-[70px] sm:h-[80px] lg:h-[90px] flex items-center px-8 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Package className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = isActiveRoute(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
                  ${isActive
                    ? 'bg-white text-[#485e38] shadow-xl font-bold translate-x-1'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-[#485e38]' : ''}`} />
                <span className="text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#485e38] animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

      </aside>
    </>
  )
}

export default Sidebar
