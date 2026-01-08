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
    // Check for access token
    const token = Cookies.get('access_token')
    
    if (!token) {
      // No token found, redirect to login
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }
    
    // Token exists, allow access
    setIsAuthenticated(true)
  }, [router])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render (redirect is happening)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className='min-h-screen '>
      <NavbarDashboard isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
       <div className="min-h-screen pt-20 sm:pt-24 lg:pt-28  py-4 sm:py-6 lg:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
         <div className='min-h-[70vh] '>
           <main className={`bg-secondary-foreground rounded-xl sm:rounded-2xl
            lg:rounded-[52px] lg:min-h-[80vh]
       py-4 sm:py-6 lg:py-10 mb-10 sm:mb-16 lg:mb-20  z-50 `}>
             {children}
           </main>
         </div>
       </div>
    </div>
  )
}
  
export default Layout