'use client'
import React, { useState } from 'react'
import NavbarDashboard from './components/Navbar'
import Sidebar from './components/Sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  

  return (
    <div className='min-h-screen bg-gradient-to-br from-yellow-500 to-yellow-300 text-black'>
      <NavbarDashboard isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
       <div className="h-screen pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-32">
         <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}  />
         <div className='min-h-[70vh] 0 '>
           <main className={`bg-secondary-foreground rounded-2xl lg:rounded-[52px] lg:min-h-[80vh] px-4 lg:px-10 py-10 lg:ml-56 
            bg-gradient-to-r from-yellow-500 to-yellow-300`}>
             {children}
           </main>
         </div>
       </div>
    </div>
  )
}

export default Layout