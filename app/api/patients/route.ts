import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Patient from '../../models/Patient'

// Ensure database connection is established when this module is loaded
await connectToDatabase()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, age, address, zipCode } = body

    const data = new Patient({
      firstName,
      lastName,
      age,
      address,
      zipCode,
    })

    await data.save()

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating patient', error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const patients = await Patient.find() // Fetch all patients from the database
    return NextResponse.json(patients, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching patients', error },
      { status: 500 }
    )
  }
}

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
