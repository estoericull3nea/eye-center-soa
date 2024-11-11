'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

import { Poppins } from 'next/font/google'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className={`${poppins.className}  flex justify-center  w-screen`}>
      <div className=' flex flex-col text-center w-full items-center'>
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

        <div className='flex flex-col items-center  p-10 rounded-2xl space-y-4 w-full max-w-[1400px] border border-black'>
          <div className='flex  gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='patient_label'>
                Patient Name
              </Label>
              <Input className=' ' type='text' id='patient_label' />
            </div>
            <div className='text-start   w-full'>
              <Label className='mb-10' htmlFor='age_label'>
                Age
              </Label>
              <Input className=' ' type='text' id='age_label' />
            </div>
          </div>
          <div className='flex  gap-3 w-full'>
            <div className='text-start  w-full'>
              <Label className='mb-10' htmlFor='address_label'>
                Address
              </Label>
              <Input className=' ' type='text' id='address_label' />
            </div>
            <div className='text-start  w-full'>
              <Label className='mb-10' htmlFor='zip_code_label'>
                Zip Code
              </Label>
              <Input className=' ' type='text' id='zip_code_label' />
            </div>
          </div>
          <div className='flex  gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='date_admitted_label'>
                Date Admitted
              </Label>
              <Input className=' ' type='text' id='date_admitted_label' />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='time_admitted_label'>
                Time Admittted
              </Label>
              <Input className=' ' type='text' id='time_admitted_label' />
            </div>
          </div>
          <div className='flex  gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='date_discharged_label'>
                Date Discharged
              </Label>
              <Input className=' ' type='text' id='date_discharged_label' />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='time_discharge_label'>
                Time Discharge
              </Label>
              <Input className=' ' type='text' id='time_discharge_label' />
            </div>
          </div>

          <div className='flex  gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='first_case_rate_label'>
                First case rate:
              </Label>
              <Input
                className=' '
                type='text'
                id='first_case_rae_labele'
                placeholder='67031'
              />
            </div>
          </div>
          <div className='flex  gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='second_case_rate_label'>
                Second case rate:
              </Label>
              <Input className=' ' type='text' id='second_case_rate_label' />
            </div>
          </div>

          <div className='flex  gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='admitting_diagnosis_label'>
                Admitting Diagnosis
              </Label>
              <Input className=' ' type='text' id='admitting_diagnosis_label' />
            </div>
          </div>
          <div className='flex  gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='discharge_diagnosis_label'>
                Discharge Diagnosis
              </Label>
              <Input className=' ' type='text' id='discharge_diagnosi_labels' />
            </div>
          </div>

          <div className='text-start  w-full block mt-10'>
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

                {/* Laser Fee, Supplies, and Medicines as child rows of HCI FEES */}
                <TableRow>
                  <TableCell className='font-medium'>Laser Fee</TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className='font-medium'>Supplies</TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className='font-medium'>Medicines</TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                  <TableCell>
                    <Input type='text' />
                  </TableCell>
                </TableRow>

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
