'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { columns } from './columns'
import { DataTable } from './data-table'
import { Poppins } from 'next/font/google'
import { Skeleton } from '@/components/ui/skeleton'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

// Define the Patient type based on your backend data structure
export interface Patient {
  _id: string
  firstName: string
  lastName: string
  age: number
  address: string
  zipCode: string
  firstCaseRate: number
  secondCaseRate: number
  admittingDiagnosis: string
  dischargeDiagnosis: string
}

export default function DemoPage() {
  const [data, setData] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true) // Loading state

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      setLoading(true) // Set loading to true before fetching
      try {
        const response = await axios.get<Patient[]>('/api/patients')
        setData(response.data)
      } catch (error) {
        console.error('Error fetching patient data:', error)
      } finally {
        setLoading(false) // Set loading to false after fetching
      }
    }

    fetchData()
  }, [])

  return (
    <div className={`${poppins.className} flex ml-36 mb-10`}>
      <div className='flex flex-col text-center w-full items-center'>
        {loading ? (
          <SkeletonTable /> // Render skeleton if loading is true
        ) : (
          <DataTable<Patient, unknown> columns={columns} data={data} />
        )}
      </div>
    </div>
  )
}

// SkeletonTable component for loading state
function SkeletonTable() {
  return (
    <div className='w-full p-4 space-y-4'>
      <Skeleton className='h-10 w-full' /> {/* Header skeleton */}
      <div className='space-y-2'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex space-x-2'>
            <Skeleton className='h-8 w-[230px]' /> {/* First column */}
            <Skeleton className='h-8 w-[230px]' /> {/* Second column */}
            <Skeleton className='h-8 w-[230px]' /> {/* Third column */}
            <Skeleton className='h-8 w-[230px]' /> {/* Fourth column */}
            <Skeleton className='h-8 w-[230px]' /> {/* Fifth column */}
          </div>
        ))}
      </div>
    </div>
  )
}
