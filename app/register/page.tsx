'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export default function Page() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await axios.post('/api/register', { username, password })
      setMessage(response.data.message)
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${poppins.className} flex items-center h-screen`}>
      <div className='max-w-md mx-auto mt-10 p-5 border rounded shadow w-[400px]'>
        <h1 className='text-2xl font-bold mb-5'>Admin Registration</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block mb-2'>Username</label>
            <Input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='block mb-2'>Password</label>
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type='submit' disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </Button>
        </form>
        {message && <p className='mt-4 text-center text-red-500'>{message}</p>}
      </div>
    </div>
  )
}
