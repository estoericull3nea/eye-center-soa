'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Poppins } from 'next/font/google'

import { useRouter } from 'next/navigation'

interface Admin {
  _id: string
  username: string
  age: number
  address: string
  zipCode: string
  firstCaseRate: number
  secondCaseRate: number
  admittingDiagnosis: string
  dischargeDiagnosis: string
}

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export default function AdminTable() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  // Fetch all admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admins')
        const data = await response.json()
        setAdmins(data)
      } catch (error) {
        console.error('Error fetching admins:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmins()
  }, [])

  if (loading) {
    // Return skeleton loading if data is still being fetched
    return (
      <div className='space-y-4'>
        <Table>
          <TableCaption>Loading...</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[200px]'>
                <Skeleton className='h-6 w-24' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-6 w-32' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-6 w-32' />
              </TableHead>
              <TableHead className='text-right'>
                <Skeleton className='h-6 w-20' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='font-medium border'>
                <Skeleton className='h-6 w-24' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-32' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-32' />
              </TableCell>
              <TableCell className='text-right'>
                <Skeleton className='h-6 w-20' />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className={`${poppins.className} flex ml-36 mb-10`}>
      <div className='flex flex-col text-center w-full items-center'>
        <div className='flex flex-col items-center p-10 rounded-2xl space-y-4 w-full max-w-[1400px] border border-black'>
          <Table>
            <TableCaption>A list of your recent admins.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[300px] '>Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell className='font-medium text-start'>
                    {admin.username}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
