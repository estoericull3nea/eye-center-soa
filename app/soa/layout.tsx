import { SidebarTrigger } from '@/components/ui/sidebar'

// Make sure you do NOT include AppSidebar here, as it's already in RootLayout

export default function SoaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* No need to wrap AppSidebar again, just include SidebarTrigger if needed */}
      <SidebarTrigger /> {/* Only use SidebarTrigger if necessary */}
      {children}
    </div>
  )
}
