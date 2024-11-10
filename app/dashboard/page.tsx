'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = localStorage.getItem('authToken')

    // Redirect to login if token is not found
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return <h1>Dashboard</h1>
}
