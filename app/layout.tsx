import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import './globals.css'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export const metadata: Metadata = {
  title: 'Eye Center SOA',
  description: 'SOA for automation',
  icons: {
    icon: '/eye-center-logo.png', // This points to /public/favicon.ico
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <Toaster />

        <SidebarProvider>
          <AppSidebar /> {/* Only render the sidebar once here */}
          <main>{children}</main>
        </SidebarProvider>
      </body>
    </html>
  )
}
