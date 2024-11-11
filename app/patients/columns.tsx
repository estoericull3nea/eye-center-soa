import { ColumnDef } from '@tanstack/react-table'
import { Patient } from './page'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'

// Define columns for the DataTable component
export const columns: ColumnDef<Patient>[] = [
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
    accessorKey: 'firstCaseRate',
    header: 'First Case Rate',
  },
  {
    accessorKey: 'secondCaseRate',
    header: 'Second Case Rate',
  },
  {
    accessorKey: 'admittingDiagnosis',
    header: 'Admitting Diagnosis',
  },
  {
    accessorKey: 'dischargeDiagnosis',
    header: 'Discharge Diagnosis',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const patient = row.original

      const handleEdit = () => {
        // Logic for handling edit action
        console.log('Edit', patient)
      }

      const handleDelete = () => {
        // Logic for handling delete action
        console.log('Delete', patient)
      }

      return (
        <div className='flex space-x-2'>
          <Button variant='ghost' size='sm' onClick={handleEdit}>
            <Edit className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='sm' onClick={handleDelete}>
            <Trash className='w-4 h-4 text-red-500' />
          </Button>
        </div>
      )
    },
  },
]
