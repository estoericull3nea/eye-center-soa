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
import caseRates from './procedure.json'

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

// const caseRates = [
//   {
//     rvs_code: '57265',
//     desc: 'COMBINED ANTEROPOSTERIOR COLPORRHAPHY; W/ ENTEROCELE REPAIR',
//     case_rate: 39390.0,
//     health_facility_fee: 17550.0,
//     professional_fee: 21840.0,
//   },
//   {
//     rvs_code: '57268',
//     desc: 'REPAIR OF ENTEROCELE, VAGINAL APPROACH',
//     case_rate: 30290.0,
//     health_facility_fee: 13910.0,
//     professional_fee: 16380.0,
//   },
//   {
//     rvs_code: '57270',
//     desc: 'REPAIR OF ENTEROCELE, ABDOMINAL APPROACH',
//     case_rate: 35256.0,
//     health_facility_fee: 15600.0,
//     professional_fee: 19656.0,
//   },
//   {
//     rvs_code: '57280',
//     desc: 'COLPOPEXY, ABDOMINAL APPROACH',
//     case_rate: 35256.0,
//     health_facility_fee: 15600.0,
//     professional_fee: 19656.0,
//   },
//   {
//     rvs_code: '57282',
//     desc: 'SACROSPINOUS LIGAMENT FIXATION FOR PROLAPSE OF VAGINA',
//     case_rate: 35256.0,
//     health_facility_fee: 15600.0,
//     professional_fee: 19656.0,
//   },
// ]

type FeeRow = {
  name: string
  actualCharges: string
  vat: string
  discountSC: string
  discountNonSC: string
  firstCaseAmount: string
  secondCaseAmount: string
}

interface IPatient {
  name: string
  age: string
  address: string
  zipCode: string
  // Add other fields if needed based on your API response
}

type ProfessionalFeeRow = {
  name: string
  amount: string
}

export default function DashboardPage() {
  const router = useRouter()
  const toast = useToast()
  // State for patient data and patient name
  const [patientData, setPatientData] = useState<IPatient | null>(null)
  const [patientName, setPatientName] = useState('')

  const [admittingDiagnosis, setAdmittingDiagnosis] = useState('')
  const [dischargeDiagnosis, setDischargeDiagnosis] = useState('')
  const [firstCaseRate, setFirstCaseRate] = useState('')
  const [secondCaseRate, setSecondCaseRate] = useState('')
  const [professionalFees, setProfessionalFees] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  // State to hold dynamic rows for HCI Fees
  const [dynamicRows, setDynamicRows] = useState<FeeRow[]>([])

  // State for dynamic rows of Professional Fees
  const [professionalFeeRows, setProfessionalFeeRows] = useState<
    ProfessionalFeeRow[]
  >([{ name: 'DR AUREO FRANCIS C. SANCHEZ', amount: '' }])

  // State to control the visibility of the new fee input field
  const [showNewFeeInput, setShowNewFeeInput] = useState(false)
  const [showNewProfessionalFeeInput, setShowNewProfessionalFeeInput] =
    useState(false)

  // State for the name of the new fee being added
  const [newFeeName, setNewFeeName] = useState('')
  const [newProfessionalFeeName, setNewProfessionalFeeName] = useState('')

  // Function to add a new row for HCI Fees
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

  // Function to add a new row for Professional Fees
  const handleAddProfessionalFeeRow = () => {
    if (newProfessionalFeeName.trim() === '') {
      toast.toast({
        description: 'Please enter a professional fee name',
      })
      return
    }

    // Add the new row to the professionalFeeRows state
    setProfessionalFeeRows([
      ...professionalFeeRows,
      {
        name: newProfessionalFeeName,
        amount: '',
      },
    ])

    // Reset the professional fee name and hide the input field
    setNewProfessionalFeeName('')
    setShowNewProfessionalFeeInput(false)
  }

  // Function to remove a row from HCI Fees
  const handleRemoveRow = (index: number) => {
    setDynamicRows(dynamicRows.filter((_, i) => i !== index))
  }

  // Function to remove a row from Professional Fees
  const handleRemoveProfessionalFeeRow = (index: number) => {
    setProfessionalFeeRows(professionalFeeRows.filter((_, i) => i !== index))
  }

  // Function to create a new patient if they do not exist
  const createPatient = async (patientName: string) => {
    const [firstName, lastName] = patientName.split(' ')

    // You'll need to collect additional patient details such as age, address, and zip code here
    const age = 'Unknown' // or get it from a form input
    const address = 'Unknown' // or get it from a form input
    const zipCode = 'Unknown' // or get it from a form input

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          age,
          address,
          zipCode,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.toast({
          description: 'Patient added successfully',
        })
        setPatientData(data) // Set the newly created patient data
      } else {
        toast.toast({
          description: 'Failed to create patient',
        })
      }
    } catch (error) {
      console.error('Error adding new patient:', error)
      toast.toast({
        description: 'Error adding patient. Please try again later.',
      })
    }
  }

  // Fetch patient data by name or create the patient if not found
  const fetchPatientData = async (name: string) => {
    if (!name.trim()) {
      setPatientData(null) // Clear the data if the name is empty
      return
    }

    try {
      const response = await fetch(`/api/patients?name=${name}`)
      const data = await response.json()

      if (data.length > 0) {
        setPatientData(data[0]) // Use the first patient in the list if found
      } else {
        // If no patient found, create a new patient
        await createPatient(name) // Create a new patient
      }
    } catch (error) {
      console.error('Error fetching patient data:', error)
    }
  }

  // Handle patient name input change
  const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setPatientName(name)
    fetchPatientData(name) // Fetch data as the name is typed
  }

  const handleFirstCaseRateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedCaseRate = e.target.value
    setFirstCaseRate(selectedCaseRate)

    const selectedCase = caseRates.find(
      (caseRate) => caseRate.rvs_code.toString() === selectedCaseRate // Convert case_rate to string for comparison
    )

    if (selectedCase) {
      // Autofill corresponding fields
      setAdmittingDiagnosis(selectedCase.description) // Assuming "desc" is the admitting diagnosis
      setDischargeDiagnosis(selectedCase.description) // You can customize this logic if needed
      setProfessionalFees(selectedCase.professional_fee.toString()) // Set professional fee
    } else {
      setAdmittingDiagnosis('') // Assuming "desc" is the admitting diagnosis
      setDischargeDiagnosis('') // You can customize this logic if needed
      setProfessionalFees('')
    }
  }

  return (
    <div className={`${poppins.className} flex ml-36 mb-10`}>
      <div className='flex flex-col text-center w-full items-center'>
        <Image
          src='/eye-center-main-logo.png'
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
        <h2 className='font-bold my-5'>STATEMENT OF ACCOUNT</h2>

        <div className='flex flex-col items-center p-10 rounded-2xl space-y-4 w-full max-w-[1400px] border border-black'>
          {/* Patient Information Section */}
          {/* Patient Information Section */}
          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='patient_label'>
                Patient Name
              </Label>
              <Input
                type='text'
                id='patient_label'
                value={patientName}
                onChange={handlePatientNameChange} // Handle name change
                placeholder='Enter patient name'
              />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='age_label'>
                Age
              </Label>
              <Input
                type='text'
                id='age_label'
                value={patientData?.age || ''}
              />
            </div>
          </div>
          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='address_label'>
                Address
              </Label>
              <Input
                type='text'
                id='address_label'
                value={patientData?.address || ''}
                // readOnly={!!patientData} // Make field readonly if autofilled
              />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='zip_code_label'>
                Zip Code
              </Label>
              <Input
                type='text'
                id='zip_code_label'
                value={patientData?.zipCode || ''}
                // readOnly={!!patientData} // Make field readonly if autofilled
              />
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
                value={firstCaseRate}
                onChange={handleFirstCaseRateChange} // Handle case rate change
                placeholder='67031'
              />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='second_case_rate_label'>
                Second case rate:
              </Label>
              <Input
                type='text'
                id='second_case_rate_label'
                value={secondCaseRate}
                onChange={(e) => setSecondCaseRate(e.target.value)} // Handle second case rate change
              />
            </div>
          </div>

          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='admitting_diagnosis_label'>
                Admitting Diagnosis
              </Label>
              <Input
                type='text'
                id='admitting_diagnosis_label'
                value={admittingDiagnosis}
                onChange={(e) => setAdmittingDiagnosis(e.target.value)} // Allow manual update if needed
              />
            </div>
          </div>

          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='discharge_diagnosis_label'>
                Discharge Diagnosis
              </Label>
              <Input
                type='text'
                id='discharge_diagnosis_label'
                value={dischargeDiagnosis}
                onChange={(e) => setDischargeDiagnosis(e.target.value)} // Allow manual update if needed
              />
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
                  <TableHead className='w-[150px]'>
                    20% SC/PWD Discount
                  </TableHead>
                  <TableHead className='w-[150px]'>
                    32% Non-SC Discount
                  </TableHead>
                  <TableHead className='w-[150px]'>Other Discount</TableHead>
                  <TableHead className='w-[150px]'>First Case Amount</TableHead>
                  <TableHead className='w-[150px]'>
                    Second Case Amount
                  </TableHead>
                  <TableHead className='w-[150px]'>
                    Co-pay Amount Payable
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
                      <Input
                        type='text'
                        value={row.actualCharges}
                        onChange={(e) => {
                          const updatedRows = [...dynamicRows]
                          updatedRows[index].actualCharges = e.target.value
                          setDynamicRows(updatedRows)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type='text'
                        value={row.vat}
                        onChange={(e) => {
                          const updatedRows = [...dynamicRows]
                          updatedRows[index].vat = e.target.value
                          setDynamicRows(updatedRows)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type='text'
                        value={row.discountSC}
                        onChange={(e) => {
                          const updatedRows = [...dynamicRows]
                          updatedRows[index].discountSC = e.target.value
                          setDynamicRows(updatedRows)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type='text'
                        value={row.discountNonSC}
                        onChange={(e) => {
                          const updatedRows = [...dynamicRows]
                          updatedRows[index].discountNonSC = e.target.value
                          setDynamicRows(updatedRows)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type='text'
                        value={row.firstCaseAmount}
                        onChange={(e) => {
                          const updatedRows = [...dynamicRows]
                          updatedRows[index].firstCaseAmount = e.target.value
                          setDynamicRows(updatedRows)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type='text'
                        value={row.secondCaseAmount}
                        onChange={(e) => {
                          const updatedRows = [...dynamicRows]
                          updatedRows[index].secondCaseAmount = e.target.value
                          setDynamicRows(updatedRows)
                        }}
                      />
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

                {/* Render dynamic rows for each Professional fee */}
                {professionalFeeRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>{row.name}</TableCell>
                    <TableCell className='font-medium'>
                      {professionalFees || 0}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleRemoveProfessionalFeeRow(index)}
                        className='text-red-500 hover:text-red-700'
                      >
                        Remove
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Add Button to show the input field for a new professional fee */}
                <TableRow>
                  <TableCell colSpan={2}>
                    <button
                      onClick={() => setShowNewProfessionalFeeInput(true)}
                      className='text-blue-500 underline'
                    >
                      + Add New Professional Fee
                    </button>
                  </TableCell>
                </TableRow>

                {/* Input field to add a new professional fee */}
                {showNewProfessionalFeeInput && (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <div className='flex gap-2'>
                        <Input
                          type='text'
                          value={newProfessionalFeeName}
                          onChange={(e) =>
                            setNewProfessionalFeeName(e.target.value)
                          }
                          placeholder='Enter Professional Fee Name'
                        />
                        <Button onClick={handleAddProfessionalFeeRow}>
                          Add Fee
                        </Button>
                        <Button
                          onClick={() => {
                            setShowNewProfessionalFeeInput(false)
                            setNewProfessionalFeeName('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Total Professional Fees */}
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
                  <TableCell colSpan={9}>
                    <Separator className='my-4' />
                  </TableCell>
                </TableRow>

                {/* GRAND TOTAL Row */}
                <TableRow>
                  <TableCell className='font-medium'>GRAND TOTAL</TableCell>
                  <TableCell colSpan={9}>
                    <Input type='text' />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button>Print</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
