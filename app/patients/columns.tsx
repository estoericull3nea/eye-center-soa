import { ColumnDef } from '@tanstack/react-table'
import { Patient } from './page'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Define columns for the DataTable component
export const columns = (
  setData: React.Dispatch<React.SetStateAction<Patient[]>>,
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEditPatientData: React.Dispatch<React.SetStateAction<Patient | null>>
): ColumnDef<Patient>[] => [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'zipCode',
    header: 'Zip Code',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const patient = row.original

      const handleEdit = () => {
        setEditPatientData(patient) // Pass current patient data to modal
        setEditOpen(true) // Open the edit modal
      }

      const handleDelete = async () => {
        try {
          await axios.delete(`/api/patients?id=${patient._id}`)
          setData((prevData) => prevData.filter((p) => p._id !== patient._id))
        } catch (error) {
          console.error('Error deleting patient:', error)
        }
      }

      return (
        <div className='flex space-x-2'>
          <Button variant='ghost' size='sm' onClick={handleEdit}>
            <Edit className='w-4 h-4' />
          </Button>

          {/* AlertDialog for Delete Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='ghost' size='sm'>
                <Trash className='w-4 h-4 text-red-500' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  patient record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]