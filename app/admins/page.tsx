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

export default function AdminTable() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)

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
              <TableHead className='w-[100px]'>
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
              <TableCell className='font-medium'>
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
    <div className='space-y-4'>
      <Table>
        <TableCaption>A list of your recent admins.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Username</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell className='font-medium'>{admin.username}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
