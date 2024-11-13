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
  address?: string
  zipCode?: string
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
  const [newFeePrice, setNewFeePrice] = useState('')
  const [totalHciFees, setTotalHciFees] = useState('')
  const [dynamicRows, setDynamicRows] = useState<FeeRow[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAddHciFeeEnabled, setIsAddHciFeeEnabled] = useState(false)
  const [vatAmount, setVatAmount] = useState('')
  const [scDiscountAmount, setScDiscountAmount] = useState('')
  const [healthFacilityFee, setHealthFacilityFee] = useState('')
  const [newProfessionalFeePrice, setNewProfessionalFeePrice] = useState('')
  const [totalPfFees, setTotalPfFees] = useState('')
  const [secondCaseDischargeDiagnosis, setSecondCaseDischargeDiagnosis] =
    useState('')

  const [secondCaseAdmittingDiagnosis, setSecondCaseAdmittingDiagnosis] =
    useState('')
  const [secondCaseProfessionalFees, setSecondCaseProfessionalFees] =
    useState('')
  const [secondCaseHealthFacilityFee, setSecondCaseHealthFacilityFee] =
    useState('')
  const [coPayAmount, setCoPayAmount] = useState('')

  // State for dynamic rows of Professional Fees
  const [professionalFeeRows, setProfessionalFeeRows] = useState<
    ProfessionalFeeRow[]
  >([{ name: 'DR AUREO FRANCIS C. SANCHEZ', amount: '5000' }])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    const total = dynamicRows.reduce((acc, row) => {
      const price = parseFloat(row.actualCharges) || 0
      return acc + price
    }, 0)
    // Set `totalHciFees` with comma formatting
    setTotalHciFees(total.toFixed(0))

    if (parseInt(patientData?.age || '0') >= 60) {
      const vat = total * 0.12 // Calculate 12% VAT as negative
      setVatAmount(vat.toFixed(0)) // Format VAT with commas

      // Calculate 20% SC/PWD discount on (Total HCI Fees - VAT)
      const discountedTotal = total + vat
      const scDiscount = discountedTotal * 0.2 // Make discount negative
      setScDiscountAmount(scDiscount.toFixed(0)) // Format with commas
    } else {
      setVatAmount('') // Clear VAT if age is below 60
      setScDiscountAmount('') // Clear SC/PWD discount if age is below 60
    }
  }, [dynamicRows, patientData?.age])

  useEffect(() => {
    // Enable the button if `age` has a value; disable it otherwise
    setIsAddHciFeeEnabled(!!patientData?.age)
  }, [patientData?.age])

  useEffect(() => {
    const total = professionalFeeRows.reduce((acc, row) => {
      const price = parseFloat(row.amount) || 0
      return acc + price
    }, 0)
    setTotalPfFees(total.toFixed(0)) // Format with commas
  }, [professionalFeeRows])

  // State to hold dynamic rows for HCI Fees

  // State to control the visibility of the new fee input field
  const [showNewFeeInput, setShowNewFeeInput] = useState(false)
  const [showNewProfessionalFeeInput, setShowNewProfessionalFeeInput] =
    useState(false)

  // State for the name of the new fee being added
  const [newFeeName, setNewFeeName] = useState('')
  const [newProfessionalFeeName, setNewProfessionalFeeName] = useState('')

  // Function to add a new row for HCI Fees
  const handleAddRow = () => {
    if (newFeeName.trim() === '' || newFeePrice.trim() === '') {
      toast.toast({
        title: 'Please enter both a fee name and a price',
      })
      return
    }

    // Add the new row with both name and price
    setDynamicRows([
      ...dynamicRows,
      {
        name: newFeeName,
        actualCharges: newFeePrice,
        vat: '',
        discountSC: '',
        discountNonSC: '',
        firstCaseAmount: '',
        secondCaseAmount: '',
      },
    ])

    // Reset the fee name and price, and hide the input fields
    setNewFeeName('')
    setNewFeePrice('')
    setShowNewFeeInput(false)
  }

  // Function to add a new row for Professional Fees
  const handleAddProfessionalFeeRow = () => {
    if (
      newProfessionalFeeName.trim() === '' ||
      newProfessionalFeePrice.trim() === ''
    ) {
      toast.toast({
        description: 'Please enter both a professional fee name and a price',
      })
      return
    }

    // Add the new row with both name and price
    setProfessionalFeeRows([
      ...professionalFeeRows,
      {
        name: newProfessionalFeeName,
        amount: newProfessionalFeePrice,
      },
    ])

    // Reset the name and price, and hide the input fields
    setNewProfessionalFeeName('')
    setNewProfessionalFeePrice('')
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

  // Update fetchPatientData to clear fields if no patient is found
  const fetchPatientData = async (name: string) => {
    if (!name.trim()) {
      setPatientData(null) // Clear data if the name is empty
      return
    }

    try {
      const response = await fetch(`/api/patients?name=${name}`)
      const data = await response.json()

      if (data.length > 0) {
        setPatientData(data[0]) // Use the first patient in the list if found
      } else {
        setPatientData({ name: '', age: '', address: '', zipCode: '' }) // Clear fields if no patient found
      }
    } catch (error) {
      console.error('Error fetching patient data:', error)
      setPatientData({ name: '', age: '', address: '', zipCode: '' }) // Clear fields on error
    }
  }

  // Update handlePatientNameChange to fetch data as user types
  const handlePatientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setPatientName(name)

    if (name.trim()) {
      fetchPatientData(name) // Fetch patient data if name exists
    } else {
      setPatientData({ name: '', age: '', address: '', zipCode: '' }) // Clear fields if name is cleared
    }
  }

  const handleFirstCaseRateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedCaseRate = e.target.value
    setFirstCaseRate(selectedCaseRate)

    const selectedCase = caseRates.find(
      (caseRate) => caseRate.rvs_code.toString() === selectedCaseRate
    )

    if (selectedCase) {
      setAdmittingDiagnosis(selectedCase.description)
      setProfessionalFees(selectedCase.professional_fee.toString())
      const converted = selectedCase.health_facility_fee.replaceAll(',', '')
      setHealthFacilityFee(parseFloat(converted).toFixed(0))
    } else {
      setAdmittingDiagnosis('')
      setProfessionalFees('')
      setHealthFacilityFee('') // Clear if no matching case found
    }
  }

  const handleSecondCaseRateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedCaseRate = e.target.value
    setSecondCaseRate(selectedCaseRate)

    const selectedCase = caseRates.find(
      (caseRate) => caseRate.rvs_code.toString() === selectedCaseRate
    )

    if (selectedCase) {
      setSecondCaseAdmittingDiagnosis(selectedCase.description)
      setSecondCaseProfessionalFees(selectedCase.professional_fee.toString())
      setSecondCaseHealthFacilityFee(selectedCase.health_facility_fee)

      const converted = selectedCase.health_facility_fee.replaceAll(',', '')
      setSecondCaseHealthFacilityFee(parseFloat(converted).toFixed(0))
    } else {
      setSecondCaseAdmittingDiagnosis('')
      setSecondCaseProfessionalFees('')
      setSecondCaseHealthFacilityFee('')
    }
  }

  useEffect(() => {
    // Parse the required fields as numbers, defaulting to 0 if they are empty
    const totalFees = parseFloat(totalHciFees) || 0
    const vat = parseFloat(vatAmount) || 0
    const scDiscount = parseFloat(scDiscountAmount) || 0
    const firstAmount = parseFloat(healthFacilityFee) || 0
    const secondAmount = parseFloat(secondCaseHealthFacilityFee) || 0

    console.log('totalFees:', totalFees)
    console.log('vat:', vat)
    console.log('scDiscount:', scDiscount)
    console.log('firstAmount:', firstAmount)
    console.log('secondAmount:', secondAmount)

    // Calculate the co-pay amount based on the provided values
    const coPay = totalFees - vat - scDiscount - firstAmount - secondAmount

    // Format the result with commas and set it to the coPayAmount state
    setCoPayAmount(coPay.toFixed(0))
  }, [totalHciFees, vatAmount, scDiscountAmount, firstCaseRate, secondCaseRate])

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
              />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='age_label'>
                Age
              </Label>
              <Input
                type='text'
                id='age_label'
                value={patientData?.age || ''} // Make sure age is displayed correctly, or empty if undefined
                onChange={(e) => {
                  setPatientData({
                    ...patientData, // Spread the existing state
                    name: patientData?.name || '', // Ensure name is always a string
                    age: e.target.value, // Update age based on the input field value
                  })
                }} // Editable
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
                value={patientData?.address || ''} // Display the address or an empty string if undefined
                onChange={(e) => {
                  setPatientData({
                    ...patientData, // Keep existing patient data
                    name: patientData?.name || '', // Ensure the name property is always a string
                    address: e.target.value, // Update address with the input value
                    age: patientData?.age ?? '', // Use nullish coalescing to ensure age is a string
                  })
                }} // Editable
              />
            </div>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='zip_code_label'>
                Zip Code
              </Label>
              <Input
                type='text'
                id='zip_code_label'
                value={patientData?.zipCode || ''} // Display the zipCode or an empty string if undefined
                onChange={(e) => {
                  setPatientData({
                    ...patientData, // Keep existing patient data
                    name: patientData?.name || '', // Ensure the name property is always a string
                    address: patientData?.address || '', // Ensure the name property is always a string
                    zipCode: e.target.value, // Update address with the input value
                    age: patientData?.age ?? '', // Use nullish coalescing to ensure age is a string
                  })
                }} // Editable
              />
            </div>
          </div>

          <Separator className='border border-black' />

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
          </div>

          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='admitting_diagnosis_label'>
                Admitting Diagnosis (First Case Rate)
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
                Discharge Diagnosis (First Case Rate)
              </Label>
              <Input
                type='text'
                id='discharge_diagnosis_label'
                value={dischargeDiagnosis}
                onChange={(e) => setDischargeDiagnosis(e.target.value)} // Allow manual update if needed
              />
            </div>
          </div>

          <Separator className='border border-black' />
          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='second_case_rate_label'>
                Second case rate:
              </Label>
              <Input
                type='text'
                id='second_case_rate_label'
                value={secondCaseRate}
                onChange={handleSecondCaseRateChange} // Handle second case rate change
                placeholder='67036'
              />
            </div>
          </div>

          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label
                className='mb-10'
                htmlFor='second_case_admitting_diagnosis_label'
              >
                Admitting Diagnosis (Second Case Rate)
              </Label>
              <Input
                type='text'
                id='second_case_admitting_diagnosis_label'
                value={secondCaseAdmittingDiagnosis}
                onChange={(e) =>
                  setSecondCaseAdmittingDiagnosis(e.target.value)
                } // Allow manual update if needed
              />
            </div>
          </div>

          <div className='flex gap-3 w-full'>
            <div className='text-start w-full'>
              <Label className='mb-10' htmlFor='discharge_diagnosis_label_2'>
                Discharge Diagnosis (Second Case Rate)
              </Label>
              <Input
                type='text'
                id='discharge_diagnosis_label_2'
                value={secondCaseDischargeDiagnosis}
                onChange={(e) =>
                  setSecondCaseDischargeDiagnosis(e.target.value)
                } // Reuse the dischargeDiagnosis state if applicable
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
                  <TableHead className='w-[150px]'>20% SC/PWD</TableHead>
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
                      className={`text-blue-500 underline ${
                        isAddHciFeeEnabled
                          ? ''
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!isAddHciFeeEnabled} // Disable button when `isAddHciFeeEnabled` is false
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
                        <Input
                          type='text'
                          value={newFeePrice}
                          onChange={(e) => setNewFeePrice(e.target.value)}
                          placeholder='Enter Fee Price'
                        />
                        <Button onClick={handleAddRow}>Add Fee</Button>
                        <Button
                          onClick={() => {
                            setShowNewFeeInput(false)
                            setNewFeeName('')
                            setNewFeePrice('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                <TableRow>
                  <TableCell className='font-bold text-green-700'>
                    Total HCI Fees
                  </TableCell>
                  <TableCell>
                    <Input type='text' value={totalHciFees} readOnly />
                  </TableCell>
                  <TableCell>
                    <Input
                      type='text'
                      value={vatAmount ? `-${vatAmount}` : 'N/A'}
                      readOnly
                      placeholder='N/A'
                      style={{ color: vatAmount ? 'red' : 'inherit' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type='text'
                      value={scDiscountAmount ? `-${scDiscountAmount}` : 'N/A'}
                      readOnly
                      placeholder='N/A'
                      style={{ color: scDiscountAmount ? 'red' : 'inherit' }}
                    />
                  </TableCell>
                  <TableCell>here</TableCell>
                  <TableCell>
                    <Input type='text' value={healthFacilityFee} readOnly />
                  </TableCell>
                  <TableCell>
                    <Input
                      type='text'
                      value={secondCaseHealthFacilityFee}
                      readOnly
                    />
                  </TableCell>
                  <TableCell>
                    <Input type='text' value={coPayAmount} readOnly />
                  </TableCell>
                </TableRow>

                {/* Separator after Laser Fee, Supplies, and Medicines */}
                <TableRow>
                  <TableCell colSpan={9}>
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
                {/* Render dynamic rows for each Professional fee */}
                {professionalFeeRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>{row.name}</TableCell>

                    <TableCell className='font-medium'>
                      <Input
                        type='text'
                        value={row.amount || ''}
                        onChange={(e) => {
                          const updatedRows = [...professionalFeeRows]
                          updatedRows[index].amount = e.target.value // Update the specific row's amount
                          setProfessionalFeeRows(updatedRows)
                        }}
                        placeholder='Enter Professional Fee Amount'
                      />
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
                    <TableCell colSpan={7}>
                      <div className='flex gap-2'>
                        <Input
                          type='text'
                          value={newProfessionalFeeName}
                          onChange={(e) =>
                            setNewProfessionalFeeName(e.target.value)
                          }
                          placeholder='Enter Professional Fee Name'
                        />
                        <Input
                          type='text'
                          value={newProfessionalFeePrice}
                          onChange={(e) =>
                            setNewProfessionalFeePrice(e.target.value)
                          }
                          placeholder='Enter Professional Fee Price'
                        />
                        <Button onClick={handleAddProfessionalFeeRow}>
                          Add Fee
                        </Button>
                        <Button
                          onClick={() => {
                            setShowNewProfessionalFeeInput(false)
                            setNewProfessionalFeeName('')
                            setNewProfessionalFeePrice('')
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
                    <Input type='text' value={totalPfFees} readOnly />
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
