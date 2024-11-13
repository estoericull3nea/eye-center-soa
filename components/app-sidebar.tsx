'use client'

import { useRouter } from 'next/navigation'
import {
  AiOutlineHome,
  AiOutlineInbox,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineLogout,
} from 'react-icons/ai'

import { Poppins } from 'next/font/google'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Image from 'next/image'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

// Menu items with React Icons
const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: AiOutlineHome,
  },
  {
    title: 'SOA',
    url: '/soa',
    icon: AiOutlineInbox,
  },
  {
    title: 'Patients',
    url: '/patients',
    icon: AiOutlineCalendar,
  },
  {
    title: 'Admins',
    url: '/admins',
    icon: AiOutlineUser,
  },
  {
    title: 'Logout',
    icon: AiOutlineLogout,
  },
]

export function AppSidebar() {
  const router = useRouter()

  // Function to handle logout
  const handleLogout = () => {
    // Clear authToken from localStorage
    localStorage.removeItem('authToken')

    // Optionally, redirect user to the login page or home page
    router.push('/login') // or '/' for the homepage
  }

  return (
    <Sidebar className={poppins.className}>
      <SidebarContent>
        <SidebarGroup>
          <Image
            src='/eye-center-main-logo.png'
            alt='Logo'
            width={150}
            height={150}
            className='mx-auto w-full my-5'
          />
          <SidebarGroupLabel className='font-medium'>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem
                  key={item.title + index}
                  className='font-medium'
                >
                  {item.title === 'Logout' ? (
                    // Logout item with the click handler
                    <SidebarMenuButton asChild>
                      <a
                        href='#'
                        className='flex items-center space-x-2'
                        onClick={(e) => {
                          e.preventDefault() // Prevent default link behavior
                          handleLogout() // Trigger logout
                        }}
                      >
                        <item.icon className='w-5 h-5' /> {/* Icon */}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  ) : (
                    // Regular menu items (Dashboard, SOA, etc.)
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className='flex items-center space-x-2'
                      >
                        <item.icon className='w-5 h-5' /> {/* Icon */}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
