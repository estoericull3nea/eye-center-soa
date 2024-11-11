'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { columns } from './columns'
import { DataTable } from './data-table'
import { Poppins } from 'next/font/google'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export default function Page() {
  const [data, setData] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true) // Loading state
  const [open, setOpen] = useState(false) // Modal open state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    zipCode: '',
    firstCaseRate: '',
    secondCaseRate: '',
    admittingDiagnosis: '',
    dischargeDiagnosis: '',
  }) // Form state
  const { toast } = useToast()

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddPatient = async () => {
    try {
      const response = await axios.post<Patient>('/api/patients', {
        ...formData,
        age: parseInt(formData.age),
        firstCaseRate: parseFloat(formData.firstCaseRate),
        secondCaseRate: parseFloat(formData.secondCaseRate),
      })
      if (response.status === 201) {
        toast({
          title: 'Patient Added',
        })
        setData((prev) => [...prev, response.data])

        setOpen(false) // Close modal after adding patient
        setFormData({
          firstName: '',
          lastName: '',
          age: '',
          address: '',
          zipCode: '',
          firstCaseRate: '',
          secondCaseRate: '',
          admittingDiagnosis: '',
          dischargeDiagnosis: '',
        })
      }
    } catch (error) {
      console.error('Error adding patient:', error)
    }
  }

  return (
    <div className={`${poppins.className} flex flex-col items-center`}>
      {/* Add Patient Button */}
      <div className='text-end w-full'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Patient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              {/* Form fields for adding a new patient */}
              {[
                'firstName',
                'lastName',
                'age',
                'address',
                'zipCode',
                'firstCaseRate',
                'secondCaseRate',
                'admittingDiagnosis',
                'dischargeDiagnosis',
              ].map((field) => (
                <div key={field} className='flex flex-col space-y-1'>
                  <Label htmlFor={field}>
                    {field
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    type={
                      field === 'age' ||
                      field === 'firstCaseRate' ||
                      field === 'secondCaseRate'
                        ? 'number'
                        : 'text'
                    }
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleAddPatient} className='mt-4 w-full'>
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className='w-full text-center'>
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
