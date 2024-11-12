import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Patient from '../../models/Patient'

// Ensure database connection is established when this module is loaded
await connectToDatabase()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let { firstName, lastName, age, address, zipCode } = body

    if (!age) {
      age = 0
    }
    // Validate required fields
    if (!firstName || !lastName || !age) {
      return NextResponse.json(
        { message: 'Missing required fields: firstName, lastName, and/or age' },
        { status: 400 }
      )
    }

    // Validate age (must be a valid number)
    if (isNaN(age) || age <= 0) {
      return NextResponse.json(
        { message: 'Invalid age, it must be a positive number' },
        { status: 400 }
      )
    }

    // Create a new Patient instance
    const data = new Patient({
      firstName,
      lastName,
      age,
      address, // Address is optional
      zipCode, // zipCode is optional
    })

    // Save the patient to the database
    await data.save()

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating patient', error },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const patientName = url.searchParams.get('name')?.trim()

    // If a patient name is provided, search for matching patients
    let patients = []
    if (patientName) {
      patients = await Patient.find({
        $or: [
          { firstName: { $regex: patientName, $options: 'i' } },
          { lastName: { $regex: patientName, $options: 'i' } },
        ],
      })
    } else {
      patients = await Patient.find() // Fetch all patients if no name is provided
    }

    return NextResponse.json(patients, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching patients', error },
      { status: 500 }
    )
  }
}

// export async function GET() {
//   try {
//     const patients = await Patient.find() // Fetch all patients from the database
//     return NextResponse.json(patients, { status: 200 })
//   } catch (error) {
//     return NextResponse.json(
//       { message: 'Error fetching patients', error },
//       { status: 500 }
//     )
//   }
// }

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') // Get the patient ID from query parameters

    if (!id) {
      return NextResponse.json(
        { message: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const deletedPatient = await Patient.findByIdAndDelete(id) // Delete the patient by ID

    if (!deletedPatient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Patient deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting patient', error },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') // Get the patient ID from query parameters

    if (!id) {
      return NextResponse.json(
        { message: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const updatedFields = {
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age,
      address: body.address,
      zipCode: body.zipCode,
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied to updated fields
    })

    if (!updatedPatient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: updatedPatient }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating patient', error },
      { status: 500 }
    )
  }
}
