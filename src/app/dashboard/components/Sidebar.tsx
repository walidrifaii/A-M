'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { MdSpaceDashboard } from 'react-icons/md'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isRTL?: boolean
}

const Sidebar = ({ isOpen, setIsOpen, isRTL = false }: SidebarProps) => {
  const pathname = usePathname()

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

  const menuItems = [
    {
      href: '/dashboard',
      icon: <MdSpaceDashboard size={25} />,
      label: 'Dashboard'
    },
    {
      href: '/category',
      icon: <MdSpaceDashboard size={25} />,
      label: 'category'
    },
    {
      href: '/products',
      icon: <MdSpaceDashboard size={25} />,
      label: 'products'
    },
  ]

  return (
    <>

      {/* ====== Overlay for mobile ====== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ====== Sidebar ====== */}
      <div
        className={`
           fixed top-0 lg:top-28
           bg-transparent z-50 lg:z-auto
           flex flex-col
           h-full lg:h-auto
           w-72 lg:w-56
           px-6 lg:px-0
           transition-transform duration-300 ease-in-out
           overflow-y-auto
           ${isRTL
            ? `right-0 lg:right-12 xl:right-16 2xl:right-32 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`
            : `left-0 lg:left-12 xl:left-16 2xl:left-32 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`
          }
         `}
      >
        <div className="flex-shrink-0 pt-0 lg:pt-6">
          <h1 className={`hidden lg:block text-[28px] lg:text-[30px] text-gray-500  mb-8 ${isRTL ? 'font-fontArabicBold' : 'font-segoeuibold'}`}>
            Manage
          </h1>
          <Link href={'/pages'} >
            <Image
              src={'/images/logo.svg'}
              alt='logo'
              width={60}
              height={60}
              className="sm:w-16 sm:h-16 w-20 h-20   mb-4 lg:hidden"
            />
          </Link>
        </div>

        {/* ====== Navigation ====== */}
        <nav className="flex-1 space-y-1 pb-8 lg:pb-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)} // auto close sidebar on mobile
                className={`
                  flex items-center gap-3 px-4 py-4 lg:py-4 rounded-xl lg:rounded-none transition-all duration-200
                  ${isRTL
                    ? 'lg:rounded-r-full'
                    : 'lg:rounded-l-full'
                  }
                  ${isActive
                    ? 'bg-white font-centurygothicbold '
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }
                  active:scale-95 lg:active:scale-100
                `}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <span className={`${isRTL && isActive ? 'font-fontArabicBold' : ''}  text-[16px] `}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
