'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

import { Poppins } from 'next/font/google'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

import { Separator } from '@/components/ui/separator'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

type FeeRow = {
  name: string
  actualCharges: string
  vat: string
  discountSC: string
  discountNonSC: string
  firstCaseAmount: string
  secondCaseAmount: string
}

export default function DashboardPage() {
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  // State to hold dynamic rows for HCI Fees
  const [dynamicRows, setDynamicRows] = useState<FeeRow[]>([])

  // State to control the visibility of the new fee input field
  const [showNewFeeInput, setShowNewFeeInput] = useState(false)

  // State for the name of the new fee being added
  const [newFeeName, setNewFeeName] = useState('')

  // Function to add a new row
  const handleAddRow = () => {
    if (newFeeName.trim() === '') {
      toast.toast({
        description: 'Please enter a fee name',
      })
      return
    }

    // Add the new row to the dynamicRows state
    setDynamicRows([
      ...dynamicRows,
      {
        name: newFeeName,
        actualCharges: '',
        vat: '',
        discountSC: '',
        discountNonSC: '',
        firstCaseAmount: '',
        secondCaseAmount: '',
      },
    ])

    // Reset the fee name and hide the input field
    setNewFeeName('')
    setShowNewFeeInput(false)
  }

  // Function to remove a row by index
  const handleRemoveRow = (index: number) => {
    setDynamicRows(dynamicRows.filter((_, i) => i !== index))
  }

  return (
    <div className={`${poppins.className} flex justify-center w-screen`}>
      <div className='flex flex-col text-center w-full items-center'>
        <Image
          src='/images/eye-center-logo-2.png'
          alt='Logo'
          width={500}
          height={500}
          className='mb-5'
        />
        <h1 className='text-lg font-semibold'>
          RIZAL AVE., SAN CARLOS CITY, PANGASINAN
        </h1>
        <h3 className='text-sm text-gray-600'>
          Tel. no. (075) 568-4088 Mobile No. 0925-726-2439
        </h3>
        <h4 className='font-bold mt-5'>STATEMENT OF ACCOUNT</h4>

        <div className='flex flex-col items-center p-10 rounded-2xl space-y-4 w-full max-w-[1400px] border border-black'>
          {/* Patient Information Section */}
          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='patient_label'>
                Patient Name
              </Label>
              <Input type='text' id='patient_label' />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='age_label'>
                Age
              </Label>
              <Input type='text' id='age_label' />
            </div>
          </div>
          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='address_label'>
                Address
              </Label>
              <Input type='text' id='address_label' />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='zip_code_label'>
                Zip Code
              </Label>
              <Input type='text' id='zip_code_label' />
            </div>
          </div>

          {/* Case Rates and Diagnosis */}
          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='first_case_rate_label'>
                First case rate:
              </Label>
              <Input
                className=' '
                type='text'
                id='first_case_rate_label'
                placeholder='67031'
              />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='second_case_rate_label'>
                Second case rate:
              </Label>
              <Input type='text' id='second_case_rate_label' />
            </div>
          </div>

          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='admitting_diagnosis_label'>
                Admitting Diagnosis
              </Label>
              <Input type='text' id='admitting_diagnosis_label' />
            </div>
          </div>
          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='discharge_diagnosis_label'>
                Discharge Diagnosis
              </Label>
              <Input type='text' id='discharge_diagnosis_label' />
            </div>
          </div>

          {/* SUMMARY OF FEES Section */}
          <div className='text-start w-full block mt-10'>
            <h1 className='font-bold text-3xl'>SUMMARY OF FEES</h1>

            <Table>
              <TableCaption>Statement of Accounts</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[200px]'>Particulars</TableHead>
                  <TableHead className='w-[150px]'>Actual Charges</TableHead>
                  <TableHead className='w-[150px]'>12% VAT</TableHead>
                  <TableHead className='w-[150px]'>20% SC Discount</TableHead>
                  <TableHead className='w-[150px]'>
                    32% Non-SC Discount
                  </TableHead>
                  <TableHead className='w-[150px]'>First Case Amount</TableHead>
                  <TableHead className='w-[150px]'>
                    Second Case Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* HCI FEES Parent Row */}
                <TableRow>
                  <TableCell className='font-medium'>HCI FEES</TableCell>
                </TableRow>

                {/* Render dynamic rows for each HCI fee */}
                {dynamicRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>{row.name}</TableCell>
                    <TableCell>
                      <Input type='text' value={row.actualCharges} />
                    </TableCell>
                    <TableCell>
                      <Input type='text' value={row.vat} />
                    </TableCell>
                    <TableCell>
                      <Input type='text' value={row.discountSC} />
                    </TableCell>
                    <TableCell>
                      <Input type='text' value={row.discountNonSC} />
                    </TableCell>
                    <TableCell>
                      <Input type='text' value={row.firstCaseAmount} />
                    </TableCell>
                    <TableCell>
                      <Input type='text' value={row.secondCaseAmount} />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleRemoveRow(index)}
                        className='text-red-500 hover:text-red-700'
                      >
                        Remove
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Add Button to show the input field for a new fee */}
                <TableRow>
                  <TableCell colSpan={7}>
                    <button
                      onClick={() => setShowNewFeeInput(true)}
                      className='text-blue-500 underline'
                    >
                      + Add New HCI Fee
                    </button>
                  </TableCell>
                </TableRow>

                {/* Input field to add a new fee */}
                {showNewFeeInput && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className='flex gap-2'>
                        <Input
                          type='text'
                          value={newFeeName}
                          onChange={(e) => setNewFeeName(e.target.value)}
                          placeholder='Enter Fee Name'
                        />
                        <Button onClick={handleAddRow}>Add Fee</Button>
                        <Button
                          onClick={() => {
                            setShowNewFeeInput(false)
                            setNewFeeName('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Total HCI Fees */}
                <TableRow>
                  <TableCell className='font-bold text-green-700'>
                    Total HCI Fees
                  </TableCell>
                  <TableCell>
                    <Input type='text' readOnly />
                  </TableCell>
                </TableRow>

                {/* Separator after Laser Fee, Supplies, and Medicines */}
                <TableRow>
                  <TableCell colSpan={7}>
                    <Separator className='my-4' />
                  </TableCell>
                </TableRow>

                {/* PROFESSIONAL FEES Parent Row */}
                <TableRow>
                  <TableCell className='font-medium'>
                    PROFESSIONAL FEES
                  </TableCell>
                </TableRow>

                {/* Professional Fee Details */}
                <TableRow>
                  <TableCell className='font-medium'>
                    DR AUREO FRANCIS C. SANCHEZ
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                </TableRow>

                {/* Total PF Fees */}
                <TableRow>
                  <TableCell className='font-bold text-green-700'>
                    Total PF Fees
                  </TableCell>
                  <TableCell>
                    <Input type='text' readOnly />
                  </TableCell>
                </TableRow>

                {/* Separator after Professional Fees */}
                <TableRow>
                  <TableCell colSpan={7}>
                    <Separator className='my-4' />
                  </TableCell>
                </TableRow>

                {/* GRAND TOTAL Row */}
                <TableRow>
                  <TableCell className='font-medium'>GRAND TOTAL</TableCell>
                  <TableCell colSpan={6}>
                    <Input type='text' />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
