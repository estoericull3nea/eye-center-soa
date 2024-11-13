'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true) // Track loading state
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken') || ''
    if (!token) {
      router.push('/login')
    } else {
      setLoading(false) // Token exists, stop loading
    }
  }, [router])

  if (loading) {
    return <div>Loading...</div> // Optionally show a loading state
  }

  return <h1 className='text-3xl font-bold'>Dashboard</h1>
}
