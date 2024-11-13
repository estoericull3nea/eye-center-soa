import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />

        <SidebarProvider>
          <AppSidebar /> {/* Only render the sidebar once here */}
          <main>{children}</main>
        </SidebarProvider>
      </body>
    </html>
  )
}
