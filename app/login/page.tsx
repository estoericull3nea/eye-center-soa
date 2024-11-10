// Client-side Code
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export default function Page() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setIsFirstLoad(false), 1800) // Adjust time as needed
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await axios.post('/api/login', { username, password })
      if (response.status === 200) {
        toast({
          title: 'Success',
          description: response.data.message,
        })

        setUsername('')
        setPassword('')

        // Redirect to dashboard or appropriate page on successful login
        router.push('/dashboard')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`${poppins.className} flex items-center justify-center h-screen`}
    >
      <div className='max-w-md mx-auto mt-10 p-5 border rounded shadow w-[400px]'>
        {isFirstLoad ? (
          <SkeletonDemo />
        ) : (
          <>
            <Image
              src='/images/eye-center-logo-2.png'
              alt='Logo'
              width={150}
              height={150}
              className='mx-auto w-full mb-5'
            />
            {message && (
              <Alert variant='destructive' className='mb-1'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <h1 className='text-2xl font-extrabold my-4'>Admin Login</h1>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block mb-2'>Username</label>
                <Input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className='block mb-2'>Password</label>
                <Input
                  type='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                />
              </div>
              <Button type='submit' disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// Skeleton component aligned with content
export function SkeletonDemo() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-28 w-full' />
      <Skeleton className='h-8 w-[200px]' />
      <Skeleton className='h-4 w-[100px]' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-4 w-[100px]' />
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-10 w-[100px]' />
    </div>
  )
}
