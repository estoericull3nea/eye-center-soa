// app/login/layout.tsx
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        {/* No Sidebar in this Layout */}
        <main>{children}</main>
      </body>
    </html>
  )
}
