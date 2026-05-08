'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import NavbarDashboard from './components/Navbar'
import Sidebar from './components/Sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('access_token')
    if (!token) {
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }
    setIsAuthenticated(true)
  }, [router])

  if (isAuthenticated === null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]'>
        <div className='text-center'>
          <div className='inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent'></div>
          <p className='mt-4 text-gray-500 dark:text-gray-400 font-medium'>Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className='min-h-screen bg-gray-900 '>
      <NavbarDashboard isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content Wrapper */}
      <div className="transition-all duration-300 lg:pl-64 min-h-screen flex flex-col">
        <main className="flex-1 pt-20 sm:pt-24 lg:pt-28 p-4 sm:p-6 lg:p-8">
          <div className=" rounded-[2.5rem]  shadow-sm   min-h-[calc(100vh-10rem)] p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
  
export default Layout
