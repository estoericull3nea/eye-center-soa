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
    url: '/dashboard',
    icon: AiOutlineHome,
  },
  {
    title: 'SOA',
    url: '/soa',
    icon: AiOutlineInbox,
  },
  {
    title: 'Patient',
    url: '/patients',
    icon: AiOutlineCalendar,
  },
  {
    title: 'Admin',
    url: '/admins',
    icon: AiOutlineUser,
  },
  {
    title: 'Logout',
    url: '/logout',
    icon: AiOutlineLogout,
  },
]

export function AppSidebar() {
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className='font-medium'>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className='flex items-center space-x-2 '>
                      <item.icon className='w-5 h-5' /> {/* Icon */}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
