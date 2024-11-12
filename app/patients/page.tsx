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
}

export default function Page() {
  const [data, setData] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true) // Loading state
  const [open, setOpen] = useState(false) // Modal open state
  const [editOpen, setEditOpen] = useState(false) // Edit modal state
  const [editPatientData, setEditPatientData] = useState<Patient | null>(null) // Data for patient being edited

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    zipCode: '',
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

  useEffect(() => {
    // Only bind the event listener if the modal is open
    if (open) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Check if the pressed key is "Enter"
        if (e.key === 'Enter') {
          e.preventDefault() // Prevent default action (if any)
          handleAddPatient() // Trigger the Add Patient function
        }
      }

      // Add event listener for keydown
      window.addEventListener('keydown', handleKeyDown)

      // Cleanup the event listener when the modal closes
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [open]) // Re-run this effect whenever the modal state (`open`) changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditPatient = async () => {
    if (!editPatientData) return

    try {
      const response = await axios.patch(
        `/api/patients?id=${editPatientData._id}`,
        editPatientData
      )
      if (response.status === 200) {
        toast({
          title: 'Patient updated successfully',
        })
        setData((prev) =>
          prev.map((p) =>
            p._id === editPatientData._id ? response.data.data : p
          )
        )
        setEditOpen(false)
      }
    } catch (error) {
      console.error('Error updating patient:', error)
    }
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditPatientData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleAddPatient = async () => {
    try {
      const response = await axios.post('/api/patients', {
        ...formData,
      })

      if (response.status === 201) {
        toast({
          title: 'Patient Added',
        })

        setData((prev) => [...prev, response.data.data])
        setOpen(false) // Close the modal

        // Reset the form
        setFormData({
          firstName: '',
          lastName: '',
          age: '',
          address: '',
          zipCode: '',
        })
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // AxiosError type guard
        console.log(error.response?.data?.message)
        toast({
          title: 'Error',
          description:
            error.response?.data?.message ||
            'An error occurred while adding the patient.',
          variant: 'destructive',
        })
      } else {
        // For other types of errors
        console.log('Unexpected error:', error)
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className={`${poppins.className} flex ml-36 mb-10`}>
      <div className='flex flex-col text-center w-full items-center'>
        <div className={`${poppins.className} flex flex-col items-center`}>
          {/* Edit Patient Modal */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Patient</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                {/* Form fields for editing a patient */}
                {editPatientData &&
                  Object.keys(editPatientData).map((field) => (
                    <div key={field} className='flex flex-col space-y-1'>
                      <Label htmlFor={field}>
                        {field
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        type={field === 'age' ? 'number' : 'text'} // Fix here
                        value={editPatientData[field as keyof Patient] || ''}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  ))}
              </div>
              <Button onClick={handleEditPatient} className='mt-4 w-full'>
                Save Changes
              </Button>
            </DialogContent>
          </Dialog>

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
                  {['firstName', 'lastName', 'age', 'address', 'zipCode'].map(
                    (field) => (
                      <div key={field} className='flex flex-col space-y-1'>
                        <Label htmlFor={field}>
                          {field
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (str) => str.toUpperCase())}
                        </Label>
                        <Input
                          id={field}
                          name={field}
                          type={field === 'age' ? 'number' : 'text'} // Fix here
                          value={formData[field as keyof typeof formData]}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )
                  )}
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
              <DataTable<Patient, unknown>
                columns={columns(setData, setEditOpen, setEditPatientData)}
                data={data}
              />
            )}
          </div>
        </div>
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
